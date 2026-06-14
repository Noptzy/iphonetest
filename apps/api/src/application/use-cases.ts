import type { IphoneRepository } from "../domain/iphone/iphone-repository.ts"
import type { OrderRepository } from "../domain/order/order-repository.ts"
import { makeCreateIphone } from "./iphone/create-iphone.ts"
import { makeDeleteIphone } from "./iphone/delete-iphone.ts"
import { makeGetIphone } from "./iphone/get-iphone.ts"
import { makeListIphones } from "./iphone/list-iphones.ts"
import { makeUpdateIphone } from "./iphone/update-iphone.ts"
import { makeCancelOrder } from "./order/cancel-order.ts"
import { makeCompleteOrder } from "./order/complete-order.ts"
import { makeConfirmOrder } from "./order/confirm-order.ts"
import { makeGetOrder } from "./order/get-order.ts"
import { makeListAllOrders } from "./order/list-all-orders.ts"
import { makeListMyOrders } from "./order/list-my-orders.ts"
import { makePlaceOrder } from "./order/place-order.ts"
import { makeRejectOrder } from "./order/reject-order.ts"
import { makeUploadPaymentProof } from "./order/upload-payment-proof.ts"

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
