import type { Order } from "@/domain/order/order.ts"
import type { AuthedContext } from "@/application/shared/context.ts"
import { forbidden } from "@/application/shared/errors.ts"

export function assertCanAccessOrder(order: Order, ctx: AuthedContext) {
	const isAdmin = ctx.session.user.role === "admin"
	const isOwner = order.userId === ctx.session.user.id
	if (!isAdmin && !isOwner) throw forbidden("You cannot access this order")
}
