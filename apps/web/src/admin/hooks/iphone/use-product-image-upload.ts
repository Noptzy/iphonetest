import { useState } from "react"

interface UseProductImageUploadReturn {
	uploadImage: (file: File) => Promise<string | null>
	uploading: boolean
	error: string | null
}

/** Uploads a product image to /api/uploads/product-image. Returns the stored URL or null on failure. */
export function useProductImageUpload(): UseProductImageUploadReturn {
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function uploadImage(file: File): Promise<string | null> {
		setUploading(true)
		setError(null)
		try {
			const form = new FormData()
			form.append("file", file)
			const res = await fetch("/api/uploads/product-image", {
				method: "POST",
				body: form,
				credentials: "include",
			})
			if (!res.ok) {
				const body = await res.json().catch(() => null)
				throw new Error(body?.error ?? "Upload failed")
			}
			const { url } = (await res.json()) as { url: string }
			return url
		} catch (err) {
			const message = err instanceof Error ? err.message : "Upload failed"
			setError(message)
			return null
		} finally {
			setUploading(false)
		}
	}

	return { uploadImage, uploading, error }
}
