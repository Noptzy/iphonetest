import { badRequest, notFound } from "@api/application/shared/errors.ts"
import type { OrderRepository } from "@api/domain/order/order-repository.ts"

export interface RejectOrderInput {
	id: string
	reason: string
}

export function makeRejectOrder(orderRepo: OrderRepository) {
	return async (input: RejectOrderInput) => {
		const order = await orderRepo.findById(input.id)
		if (!order) throw notFound("Order not found")
		if (order.status !== "payment_review") {
			throw badRequest("Only orders under payment review can be rejected")
		}

		const updated = await orderRepo.updateStatus(input.id, "rejected", input.reason)
		if (!updated) throw notFound("Order not found")
		return updated
	}
}
