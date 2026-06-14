import type { UseCases } from "@api/application/use-cases.ts"
import { protectedProcedure, publicProcedure } from "@api/presentation/orpc/middleware.ts"
import { buildIphoneRouter } from "@api/presentation/routers/iphone.ts"
import { buildOrderRouter } from "@api/presentation/routers/order.ts"

export function buildRouter(useCases: UseCases) {
	return {
		health: publicProcedure.handler(() => ({ ok: true as const })),
		me: protectedProcedure.handler(({ context }) => context.session.user),
		iphone: buildIphoneRouter(useCases.iphone),
		order: buildOrderRouter(useCases.order),
	}
}

export type AppRouter = ReturnType<typeof buildRouter>
