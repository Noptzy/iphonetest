import { assertCanAccessOrder } from "@api/application/order/order-access-rule.ts"
import type { AuthedContext } from "@api/application/shared/context.ts"
import { badRequest, notFound } from "@api/application/shared/errors.ts"
import type { OrderRepository } from "@api/domain/order/order-repository.ts"

export interface UploadPaymentProofInput {
	orderId: string
	proofOfTransferUrl: string
}

export function makeUploadPaymentProof(orderRepo: OrderRepository) {
	return async (input: UploadPaymentProofInput, ctx: AuthedContext) => {
		const order = await orderRepo.findById(input.orderId)
		if (!order) throw notFound("Order not found")
		assertCanAccessOrder(order, ctx)
		if (order.status !== "pending_payment" && order.status !== "rejected") {
			throw badRequest("Payment proof can only be uploaded while awaiting payment")
		}

		const updated = await orderRepo.attachProof(input.orderId, input.proofOfTransferUrl)
		if (!updated) throw notFound("Order not found")
		return updated
	}
}
