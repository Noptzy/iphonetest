import type { AuthedContext } from "@api/application/shared/context.ts"
import type { OrderRepository } from "@api/domain/order/order-repository.ts"

export function makeListMyOrders(orderRepo: OrderRepository) {
	return (ctx: AuthedContext) => orderRepo.listByUser(ctx.session.user.id)
}
