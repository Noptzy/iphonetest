import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { type client, orpc } from "@web/libs/orpc/client.ts"

export function useAdminOrders(): UseQueryResult<
	Awaited<ReturnType<typeof client.order.listAll>>,
	Error
> {
	return useQuery(orpc.order.listAll.queryOptions({ input: {} }))
}
