import type { AppRouter } from "@api/presentation/routers/index.ts"
import type { RouterClient } from "@orpc/server"

export type { Session } from "@api/domain/ports/auth-service.ts"
export type { AppRole } from "@api/domain/user/user.ts"
export type { AppRouter }
export type AppRouterClient = RouterClient<AppRouter>
