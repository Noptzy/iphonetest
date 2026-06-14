import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { type client, orpc } from "@web/libs/orpc/client.ts"

export function useMyOrders(): UseQueryResult<
	Awaited<ReturnType<typeof client.order.listMine>>,
	Error
> {
	return useQuery(orpc.order.listMine.queryOptions({ input: {} }))
}
