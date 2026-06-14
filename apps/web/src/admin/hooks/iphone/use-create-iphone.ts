import { useMutation } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useCreateIphone(onSuccess?: () => void) {
	return useMutation(
		orpc.iphone.create.mutationOptions({ onSuccess }),
	)
}
