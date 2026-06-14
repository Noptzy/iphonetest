import { badRequest, conflict, notFound } from "@api/application/shared/errors.ts"
import type { IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"
import type { OrderRepository } from "@api/domain/order/order-repository.ts"

export interface ConfirmOrderDeps {
	iphoneRepo: IphoneRepository
	orderRepo: OrderRepository
}

export function makeConfirmOrder(deps: ConfirmOrderDeps) {
	return async (input: { id: string }) => {
		const order = await deps.orderRepo.findById(input.id)
		if (!order) throw notFound("Order not found")
		if (order.status !== "payment_review") {
			throw badRequest("Only orders under payment review can be confirmed")
		}

		const stockTaken = await deps.iphoneRepo.decreaseStock(order.iphoneId, order.quantity)
		if (!stockTaken) throw conflict("Not enough stock to fulfil this order")

		const updated = await deps.orderRepo.updateStatus(input.id, "confirmed", null)
		if (!updated) throw notFound("Order not found")
		return updated
	}
}
