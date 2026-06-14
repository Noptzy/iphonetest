import type { UseCases } from "@api/application/use-cases.ts"
import {
	adminProcedure,
	protectedProcedure,
	toAuthedContext,
} from "@api/presentation/orpc/middleware.ts"
import {
	idSchema,
	placeOrderSchema,
	rejectOrderSchema,
	uploadProofSchema,
} from "@api/presentation/orpc/schemas.ts"

export function buildOrderRouter(order: UseCases["order"]) {
	return {
		place: protectedProcedure
			.input(placeOrderSchema)
			.handler(({ input, context }) => order.place(input, toAuthedContext(context))),
		listMine: protectedProcedure.handler(({ context }) => order.listMine(toAuthedContext(context))),
		get: protectedProcedure
			.input(idSchema)
			.handler(({ input, context }) => order.get(input, toAuthedContext(context))),
		uploadProof: protectedProcedure
			.input(uploadProofSchema)
			.handler(({ input, context }) => order.uploadProof(input, toAuthedContext(context))),
		cancel: protectedProcedure
			.input(idSchema)
			.handler(({ input, context }) => order.cancel(input, toAuthedContext(context))),
		listAll: adminProcedure.handler(() => order.listAll()),
		confirm: adminProcedure.input(idSchema).handler(({ input }) => order.confirm(input)),
		reject: adminProcedure.input(rejectOrderSchema).handler(({ input }) => order.reject(input)),
		complete: adminProcedure.input(idSchema).handler(({ input }) => order.complete(input)),
	}
}
