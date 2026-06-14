import { useMutation, type UseMutationResult } from "@tanstack/react-query"

export function useUploadProductImage(): UseMutationResult<string, Error, File> {
	return useMutation({
		mutationFn: async (file: File): Promise<string> => {
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
		}
	})
}
