import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useAdminOrders() {
	return useQuery(orpc.order.listAll.queryOptions())
}
