import { buildUseCases } from "@api/application/use-cases.ts"
import { createAuthService } from "@api/infrastructure/auth/auth-service.ts"
import { buildAuth } from "@api/infrastructure/auth/better-auth.ts"
import { createRedisCache } from "@api/infrastructure/cache/redis.ts"
import { env } from "@api/infrastructure/config/env.ts"
import { createDb } from "@api/infrastructure/db/client.ts"
import { createIphoneRepository } from "@api/infrastructure/db/repositories/iphone/iphone-repository.ts"
import { createOrderRepository } from "@api/infrastructure/db/repositories/order/order-repository.ts"
import { logger } from "@api/infrastructure/observability/logger.ts"
import { createLocalFileStorage } from "@api/infrastructure/storage/local-file-storage.ts"
import { buildStaticUploadsRoute } from "@api/presentation/http/static-uploads-route.ts"
import { buildUploadRoute } from "@api/presentation/http/upload-route.ts"
import { buildRouter } from "@api/presentation/routers/index.ts"
import { serve } from "@hono/node-server"
import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins"
import { RPCHandler } from "@orpc/server/fetch"
import { ZodSmartCoercionPlugin } from "@orpc/zod"
import { sql } from "drizzle-orm"
import { Hono } from "hono"
import { cors } from "hono/cors"

const db = createDb(env.DATABASE_URL)
const auth = buildAuth(db)
const authService = createAuthService(auth)
const fileStorage = createLocalFileStorage(env.UPLOAD_DIR)
const iphoneRepo = createIphoneRepository(db)
const orderRepo = createOrderRepository(db)
const cache = createRedisCache(env.REDIS_URL)

const useCases = buildUseCases({ iphoneRepo, orderRepo, cache })
const router = buildRouter(useCases)
const rpcHandler = new RPCHandler(router)
const openapiHandler = new OpenAPIHandler(router, {
	plugins: [new ZodSmartCoercionPlugin(), new OpenAPIReferencePlugin({ docsTitle: "iPhone Marketplace API" })],
})

const app = new Hono()

app.use("*", cors({ origin: env.WEB_ORIGIN, credentials: true }))
app.get("/healthz", (c) => c.json({ ok: true }))
app.get("/ready", async (c) => {
	try {
		await db.execute(sql`select 1`)
		await cache.ping()
		return c.json({ ok: true })
	} catch {
		return c.json({ ok: false }, 503)
	}
})

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
app.route("/api/uploads", buildUploadRoute(fileStorage, authService))
app.route("/uploads", buildStaticUploadsRoute(env.UPLOAD_DIR))

app.use("/rpc/*", async (c, next) => {
	const session = await authService.getSession(c.req.raw.headers)
	const { matched, response } = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: { headers: c.req.raw.headers, session, useCases },
	})
	if (matched) return response
	await next()
})

app.use("/api/v1/*", async (c, next) => {
	const session = await authService.getSession(c.req.raw.headers)
	const { matched, response } = await openapiHandler.handle(c.req.raw, {
		prefix: "/api/v1",
		context: { headers: c.req.raw.headers, session, useCases },
	})
	if (matched) return response
	await next()
})

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
	logger.info(`API listening on http://localhost:${info.port}`)
})
