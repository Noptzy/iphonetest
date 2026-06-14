import type { OrderRepository } from "../../domain/order/order-repository.ts"
import type { AuthedContext } from "../shared/context.ts"
import { badRequest, notFound } from "../shared/errors.ts"
import { assertCanAccessOrder } from "./order-access-rule.ts"

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
