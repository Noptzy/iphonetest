import { type UseMutationResult, useMutation } from "@tanstack/react-query"
import { client } from "@web/libs/orpc/client.ts"

export function useCreateOrder(
	onSuccess?: (data: { id: string }) => void,
): UseMutationResult<{ id: string }, Error, { iphoneId: string; quantity: number }> {
	return useMutation({
		mutationFn: async (data: { iphoneId: string; quantity: number }) => {
			return await client.order.place(data)
		},
		onSuccess: (data) => {
			onSuccess?.(data)
		},
	})
}
