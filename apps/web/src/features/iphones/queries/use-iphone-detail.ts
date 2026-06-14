import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { type client, orpc } from "@web/libs/orpc/client.ts"

export function useIphoneDetail(
	id: string,
): UseQueryResult<Awaited<ReturnType<typeof client.iphone.get>>, Error> {
	return useQuery(orpc.iphone.get.queryOptions({ input: { id } }))
}
