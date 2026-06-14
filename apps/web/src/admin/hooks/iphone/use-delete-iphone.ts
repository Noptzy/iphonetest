import { useMutation } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useDeleteIphone(onSuccess?: () => void) {
	return useMutation(
		orpc.iphone.delete.mutationOptions({ onSuccess }),
	)
}
