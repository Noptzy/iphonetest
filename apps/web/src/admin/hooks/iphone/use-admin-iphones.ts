import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/libs/orpc/client.ts"

export function useAdminIphones() {
	return useQuery(orpc.iphone.list.queryOptions())
}
