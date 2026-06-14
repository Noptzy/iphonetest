import { useMutation } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useCompleteOrder(onSuccess?: () => void) {
	return useMutation(orpc.order.complete.mutationOptions({ onSuccess }))
}
