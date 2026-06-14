import type { UseCases } from "../../application/use-cases.ts"
import { protectedProcedure, publicProcedure } from "../orpc/middleware.ts"
import { buildIphoneRouter } from "./iphone.ts"
import { buildOrderRouter } from "./order.ts"

export function buildRouter(useCases: UseCases) {
	return {
		health: publicProcedure.handler(() => ({ ok: true as const })),
		me: protectedProcedure.handler(({ context }) => context.session.user),
		iphone: buildIphoneRouter(useCases.iphone),
		order: buildOrderRouter(useCases.order),
	}
}

export type AppRouter = ReturnType<typeof buildRouter>
