import { createRouter } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import type { CurrentUser } from "./libs/auth/use-session.ts"
import { routeTree } from "./routeTree.gen.ts"

export interface RouterContext {
	queryClient: QueryClient
	user: CurrentUser | null
}

export function createAppRouter(context: RouterContext) {
	return createRouter({ routeTree, context, defaultPreload: "intent" })
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createAppRouter>
	}
}
