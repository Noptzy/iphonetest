import { assertCanAccessOrder } from "@api/application/order/order-access-rule.ts"
import type { AuthedContext } from "@api/application/shared/context.ts"
import { notFound } from "@api/application/shared/errors.ts"
import type { OrderRepository } from "@api/domain/order/order-repository.ts"

export function makeGetOrder(orderRepo: OrderRepository) {
	return async (input: { id: string }, ctx: AuthedContext) => {
		const order = await orderRepo.findById(input.id)
		if (!order) throw notFound("Order not found")
		assertCanAccessOrder(order, ctx)
		return order
	}
}
