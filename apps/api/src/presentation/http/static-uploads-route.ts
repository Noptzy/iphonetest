import { promises as fs } from "node:fs"
import { extname } from "node:path"
import { logger } from "@api/infrastructure/observability/logger.ts"
import { Hono } from "hono"

const MIME_TYPES: Record<string, string> = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
}

export function buildStaticUploadsRoute(uploadDir: string) {
	const app = new Hono()

	app.get("/:filename", async (c) => {
		const filename = c.req.param("filename")
		const path = `${uploadDir}/${filename}`
		try {
			const bytes = await fs.readFile(path)
			const ext = extname(filename).toLowerCase()
			c.header("Content-Type", MIME_TYPES[ext] || "application/octet-stream")
			return c.body(bytes)
		} catch (error) {
			logger.warn({ path, error }, "Upload file not found")
			return c.notFound()
		}
	})

	return app
}
