import { Hono, type Context } from "hono"
import type { AuthService } from "../../domain/ports/auth-service.ts"
import type { FileStorage } from "../../domain/ports/file-storage.ts"

/** Handles file uploads — payment receipts and product images. */
export function buildUploadRoute(fileStorage: FileStorage, authService: AuthService) {
	const upload = new Hono()

	/** POST /payment-proof — authenticated buyers upload a transfer receipt. */
	upload.post("/payment-proof", async (c) => {
		const session = await authService.getSession(c.req.raw.headers)
		if (!session) return c.json({ error: "Authentication required" }, 401)

		return await handleFileUpload(c, fileStorage)
	})

	/** POST /product-image — admin-only upload for iPhone product images. */
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
