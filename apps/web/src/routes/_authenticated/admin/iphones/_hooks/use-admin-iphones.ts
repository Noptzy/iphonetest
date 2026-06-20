import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { type client, orpc } from "@web/libs/orpc/client.ts"

export function useAdminIphones(): UseQueryResult<
	Awaited<ReturnType<typeof client.iphone.list>>,
	Error
> {
	return useQuery(orpc.iphone.list.queryOptions({ input: {} }))
}
