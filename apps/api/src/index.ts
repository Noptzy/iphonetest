import type { RouterClient } from "@orpc/server"
import type { AppRouter } from "./presentation/routers/index.ts"

export type { AppRouter }
export type { Session } from "./domain/ports/auth-service.ts"
export type { AppRole } from "./domain/user/user.ts"
export type AppRouterClient = RouterClient<AppRouter>
