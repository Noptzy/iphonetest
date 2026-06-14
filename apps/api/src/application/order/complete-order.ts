import type { OrderRepository } from "@/domain/order/order-repository.ts"
import { badRequest, notFound } from "@/application/shared/errors.ts"

export function makeCompleteOrder(orderRepo: OrderRepository) {
	return async (input: { id: string }) => {
		const order = await orderRepo.findById(input.id)
		if (!order) throw notFound("Order not found")
		if (order.status !== "confirmed") {
			throw badRequest("Only confirmed orders can be completed")
		}

		const updated = await orderRepo.updateStatus(input.id, "completed", null)
		if (!updated) throw notFound("Order not found")
		return updated
	}
}
