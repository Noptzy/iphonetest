import { type UseMutationResult, useMutation } from "@tanstack/react-query"
import type { IphoneFormValues } from "@web/routes/_authenticated/admin/iphones/_apis/iphone-schema.ts"
import { client } from "@web/libs/orpc/client.ts"

export function useUpdateIphone(
	onSuccess?: () => void,
): UseMutationResult<
	Awaited<ReturnType<typeof client.iphone.update>>,
	Error,
	{ id: string } & IphoneFormValues
> {
	return useMutation({
		mutationFn: async (data: { id: string } & IphoneFormValues) => {
			return await client.iphone.update(data)
		},
		onSuccess: () => {
			onSuccess?.()
		},
	})
}
