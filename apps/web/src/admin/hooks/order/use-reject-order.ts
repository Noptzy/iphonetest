import { useMutation } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useRejectOrder(onSuccess?: () => void) {
	return useMutation(orpc.order.reject.mutationOptions({ onSuccess }))
}
