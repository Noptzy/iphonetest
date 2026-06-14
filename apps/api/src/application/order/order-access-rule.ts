import type { AuthedContext } from "@api/application/shared/context.ts"
import { forbidden } from "@api/application/shared/errors.ts"
import type { Order } from "@api/domain/order/order.ts"

export function assertCanAccessOrder(order: Order, ctx: AuthedContext) {
	const isAdmin = ctx.session.user.role === "admin"
	const isOwner = order.userId === ctx.session.user.id
	if (!isAdmin && !isOwner) throw forbidden("You cannot access this order")
}
