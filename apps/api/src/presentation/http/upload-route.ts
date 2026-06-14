import type { AuthService } from "@api/domain/ports/auth-service.ts"
import type { FileStorage } from "@api/domain/ports/file-storage.ts"
import { type Context, Hono } from "hono"

export function buildUploadRoute(fileStorage: FileStorage, authService: AuthService) {
	const upload = new Hono()

	upload.post("/payment-proof", async (c) => {
		const session = await authService.getSession(c.req.raw.headers)
		if (!session) return c.json({ error: "Authentication required" }, 401)

		return await handleFileUpload(c, fileStorage)
	})

	upload.post("/product-image", async (c) => {
		const session = await authService.getSession(c.req.raw.headers)
		if (!session) return c.json({ error: "Authentication required" }, 401)
		if (session.user.role !== "admin") return c.json({ error: "Admin access required" }, 403)

		return await handleFileUpload(c, fileStorage)
	})

	return upload
}

async function handleFileUpload(c: Context, fileStorage: FileStorage) {
	const form = await c.req.formData()
	const file = form.get("file")
	if (!(file instanceof File)) return c.json({ error: "Missing file" }, 400)

	const bytes = new Uint8Array(await file.arrayBuffer())
	const stored = await fileStorage.save(bytes, file.name)
	return c.json(stored)
}
