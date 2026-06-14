import type { Order } from "../../domain/order/order.ts"
import type { AuthedContext } from "../shared/context.ts"
import { forbidden } from "../shared/errors.ts"

/** Admins may touch any order; a regular user may only touch their own. */
export function assertCanAccessOrder(order: Order, ctx: AuthedContext) {
	const isAdmin = ctx.session.user.role === "admin"
	const isOwner = order.userId === ctx.session.user.id
	if (!isAdmin && !isOwner) throw forbidden("You cannot access this order")
}
