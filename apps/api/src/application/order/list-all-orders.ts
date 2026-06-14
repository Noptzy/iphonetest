import type { OrderRepository } from "@/domain/order/order-repository.ts"

export function makeListAllOrders(orderRepo: OrderRepository) {
	return () => orderRepo.listAll()
}
