import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import type { AppRouterClient } from "@saas/api"

const link = new RPCLink({
	url: `${window.location.origin}/rpc`,
	fetch: (request, init) => fetch(request, { ...init, credentials: "include" }),
})

export const client: AppRouterClient = createORPCClient(link)
export const orpc = createTanstackQueryUtils(client)
