import type { IphoneRepository } from "@/domain/iphone/iphone-repository.ts"
import type { OrderRepository } from "@/domain/order/order-repository.ts"
import type { AuthedContext } from "@/application/shared/context.ts"
import { badRequest, notFound } from "@/application/shared/errors.ts"

export interface PlaceOrderInput {
	iphoneId: string
	quantity: number
}

export interface PlaceOrderDeps {
	iphoneRepo: IphoneRepository
	orderRepo: OrderRepository
}

export function makePlaceOrder(deps: PlaceOrderDeps) {
	return async (input: PlaceOrderInput, ctx: AuthedContext) => {
		const iphone = await deps.iphoneRepo.findById(input.iphoneId)
		if (!iphone) throw notFound("iPhone not found")
		if (input.quantity < 1) throw badRequest("Quantity must be at least 1")
		if (iphone.stock < input.quantity) throw badRequest("Not enough stock available")

		return deps.orderRepo.create({
			userId: ctx.session.user.id,
			iphoneId: iphone.id,
			quantity: input.quantity,
			totalPriceIdr: iphone.priceIdr * input.quantity,
		})
	}
}
