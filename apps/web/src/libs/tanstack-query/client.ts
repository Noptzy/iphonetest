import { QueryClient } from "@tanstack/react-query"

let singleton: QueryClient | null = null

export function getQueryClient(): QueryClient {
	if (!singleton) {
		singleton = new QueryClient({
			defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
		})
	}
	return singleton
}
