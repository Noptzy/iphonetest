import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { type client, orpc } from "@web/libs/orpc/client.ts"

export function useOrderDetail(
	id: string,
): UseQueryResult<Awaited<ReturnType<typeof client.order.get>>, Error> {
	return useQuery(orpc.order.get.queryOptions({ input: { id } }))
}
