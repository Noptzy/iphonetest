import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import { client } from "@web/libs/orpc/client.ts"

export function useUploadPaymentProof(orderId: string, onUploaded: () => void): UseMutationResult<string, Error, File> {
	return useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData()
			formData.append("file", file)
			
			const response = await fetch("/api/uploads/payment-proof", {
				method: "POST",
				body: formData,
				credentials: "include",
			})
			if (!response.ok) throw new Error("Upload failed")
			const { url } = (await response.json()) as { url: string }
			await client.order.uploadProof({ orderId, proofOfTransferUrl: url })
			return url
		},
		onSuccess: () => {
			onUploaded()
		}
	})
}
