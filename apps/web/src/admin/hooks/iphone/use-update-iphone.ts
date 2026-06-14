import { useMutation } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useUpdateIphone(onSuccess?: () => void) {
	return useMutation(
		orpc.iphone.update.mutationOptions({ onSuccess }),
	)
}
