import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useGetIphone(id: string) {
	return useQuery(orpc.iphone.get.queryOptions({ input: { id } }))
}
