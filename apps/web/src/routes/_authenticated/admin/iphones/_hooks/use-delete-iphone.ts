import { type UseMutationResult, useMutation } from "@tanstack/react-query"
import { client } from "@web/libs/orpc/client.ts"

export function useDeleteIphone(
	onSuccess?: () => void,
): UseMutationResult<Awaited<ReturnType<typeof client.iphone.delete>>, Error, { id: string }> {
	return useMutation({
		mutationFn: async (data: { id: string }) => {
			return await client.iphone.delete(data)
		},
		onSuccess: () => {
			onSuccess?.()
		},
	})
}
