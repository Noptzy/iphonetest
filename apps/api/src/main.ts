import { serve } from "@hono/node-server"
import { promises as fs } from "node:fs"
import { extname } from "node:path"
import { RPCHandler } from "@orpc/server/fetch"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { buildUseCases } from "@/application/use-cases.ts"
import { createAuthService } from "@/infrastructure/auth/auth-service.ts"
import { buildAuth } from "@/infrastructure/auth/better-auth.ts"
import { env } from "@/infrastructure/config/env.ts"
import { createDb } from "@/infrastructure/db/client.ts"
import { createIphoneRepository } from "@/infrastructure/db/repositories/iphone/iphone-repository.ts"
import { createOrderRepository } from "@/infrastructure/db/repositories/order/order-repository.ts"
import { logger } from "@/infrastructure/observability/logger.ts"
import { createLocalFileStorage } from "@/infrastructure/storage/local-file-storage.ts"
import { buildUploadRoute } from "@/presentation/http/upload-route.ts"
import { buildRouter } from "@/presentation/routers/index.ts"


const db = createDb(env.DATABASE_URL)
const auth = buildAuth(db)
const authService = createAuthService(auth)
const fileStorage = createLocalFileStorage(env.UPLOAD_DIR)
const iphoneRepo = createIphoneRepository(db)
const orderRepo = createOrderRepository(db)

const useCases = buildUseCases({ iphoneRepo, orderRepo })
const router = buildRouter(useCases)
const rpcHandler = new RPCHandler(router)

const app = new Hono()

app.use("*", cors({ origin: env.WEB_ORIGIN, credentials: true }))
app.get("/healthz", (c) => c.json({ ok: true }))

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
app.route("/api/uploads", buildUploadRoute(fileStorage, authService))
const mimeTypes: Record<string, string> = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
}

app.get("/uploads/:filename", async (c) => {
	const filename = c.req.param("filename")
	const path = `${env.UPLOAD_DIR}/${filename}`
	try {
		const bytes = await fs.readFile(path)
		const ext = extname(filename).toLowerCase()
		c.header("Content-Type", mimeTypes[ext] || "application/octet-stream")
		return c.body(bytes)
	} catch (e) {
		console.error("Error reading file:", path, e)
		return c.notFound()
	}
})

app.use("/rpc/*", async (c, next) => {
	const session = await authService.getSession(c.req.raw.headers)
	const { matched, response } = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: { headers: c.req.raw.headers, session, useCases },
	})
	if (matched) return response
	await next()
})

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
	logger.info(`API listening on http://localhost:${info.port}`)
})
