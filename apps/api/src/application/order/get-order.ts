import type { OrderRepository } from "@/domain/order/order-repository.ts"
import type { AuthedContext } from "@/application/shared/context.ts"
import { notFound } from "@/application/shared/errors.ts"
import { assertCanAccessOrder } from "@/application/order/order-access-rule.ts"

export function makeGetOrder(orderRepo: OrderRepository) {
	return async (input: { id: string }, ctx: AuthedContext) => {
		const order = await orderRepo.findById(input.id)
		if (!order) throw notFound("Order not found")
		assertCanAccessOrder(order, ctx)
		return order
	}
}
