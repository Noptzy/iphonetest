import { useMutation } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useConfirmOrder(onSuccess?: () => void) {
	return useMutation(orpc.order.confirm.mutationOptions({ onSuccess }))
}
