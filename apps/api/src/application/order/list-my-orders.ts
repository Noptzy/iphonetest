import type { OrderRepository } from "../../domain/order/order-repository.ts"
import type { AuthedContext } from "../shared/context.ts"

export function makeListMyOrders(orderRepo: OrderRepository) {
	return (ctx: AuthedContext) => orderRepo.listByUser(ctx.session.user.id)
}
