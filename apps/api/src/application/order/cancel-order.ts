import { assertCanAccessOrder } from "@api/application/order/order-access-rule.ts"
import type { AuthedContext } from "@api/application/shared/context.ts"
import { badRequest, notFound } from "@api/application/shared/errors.ts"
import type { OrderRepository } from "@api/domain/order/order-repository.ts"

export function makeCancelOrder(orderRepo: OrderRepository) {
	return async (input: { id: string }, ctx: AuthedContext) => {
		const order = await orderRepo.findById(input.id)
		if (!order) throw notFound("Order not found")
		assertCanAccessOrder(order, ctx)
		if (order.status !== "pending_payment") {
			throw badRequest("Only orders awaiting payment can be cancelled")
		}

		const updated = await orderRepo.updateStatus(input.id, "cancelled", null)
		if (!updated) throw notFound("Order not found")
		return updated
	}
}
