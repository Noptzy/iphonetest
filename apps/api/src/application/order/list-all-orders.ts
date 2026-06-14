import type { OrderRepository } from "@api/domain/order/order-repository.ts"

export function makeListAllOrders(orderRepo: OrderRepository) {
	return () => orderRepo.listAll()
}
