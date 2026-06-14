import { makeCreateIphone } from "@api/application/iphone/create-iphone.ts"
import { makeDeleteIphone } from "@api/application/iphone/delete-iphone.ts"
import { makeGetIphone } from "@api/application/iphone/get-iphone.ts"
import { makeListIphones } from "@api/application/iphone/list-iphones.ts"
import { makeUpdateIphone } from "@api/application/iphone/update-iphone.ts"
import { makeCancelOrder } from "@api/application/order/cancel-order.ts"
import { makeCompleteOrder } from "@api/application/order/complete-order.ts"
import { makeConfirmOrder } from "@api/application/order/confirm-order.ts"
import { makeGetOrder } from "@api/application/order/get-order.ts"
import { makeListAllOrders } from "@api/application/order/list-all-orders.ts"
import { makeListMyOrders } from "@api/application/order/list-my-orders.ts"
import { makePlaceOrder } from "@api/application/order/place-order.ts"
import { makeRejectOrder } from "@api/application/order/reject-order.ts"
import { makeUploadPaymentProof } from "@api/application/order/upload-payment-proof.ts"
import type { IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"
import type { OrderRepository } from "@api/domain/order/order-repository.ts"

export interface Dependencies {
	iphoneRepo: IphoneRepository
	orderRepo: OrderRepository
}

export function buildUseCases(deps: Dependencies) {
	return {
		iphone: {
			list: makeListIphones(deps.iphoneRepo),
			get: makeGetIphone(deps.iphoneRepo),
			create: makeCreateIphone(deps.iphoneRepo),
			update: makeUpdateIphone(deps.iphoneRepo),
			delete: makeDeleteIphone(deps.iphoneRepo),
		},
		order: {
			place: makePlaceOrder(deps),
			listMine: makeListMyOrders(deps.orderRepo),
			get: makeGetOrder(deps.orderRepo),
			uploadProof: makeUploadPaymentProof(deps.orderRepo),
			cancel: makeCancelOrder(deps.orderRepo),
			listAll: makeListAllOrders(deps.orderRepo),
			confirm: makeConfirmOrder(deps),
			reject: makeRejectOrder(deps.orderRepo),
			complete: makeCompleteOrder(deps.orderRepo),
		},
	}
}

export type UseCases = ReturnType<typeof buildUseCases>
