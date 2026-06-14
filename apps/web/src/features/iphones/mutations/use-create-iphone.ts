import { type UseMutationResult, useMutation } from "@tanstack/react-query"
import type { IphoneFormValues } from "@web/features/iphones/schemas/iphone.schema.ts"
import { client } from "@web/libs/orpc/client.ts"

export function useCreateIphone(
	onSuccess?: () => void,
): UseMutationResult<Awaited<ReturnType<typeof client.iphone.create>>, Error, IphoneFormValues> {
	return useMutation({
		mutationFn: async (data: IphoneFormValues) => {
			return await client.iphone.create(data)
		},
		onSuccess: () => {
			onSuccess?.()
		},
	})
}
