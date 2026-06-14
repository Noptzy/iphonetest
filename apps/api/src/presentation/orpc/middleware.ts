import { ORPCError, os } from "@orpc/server"
import { AppError } from "../../application/shared/errors.ts"
import type { AuthedContext } from "../../application/shared/context.ts"
import type { AppRole } from "../../domain/user/user.ts"
import type { ORPCContext } from "./context.ts"
import { mapAppErrorCode } from "./error-mapping.ts"

const base = os.$context<ORPCContext>()

/** Translates a thrown AppError into the matching ORPCError; rethrows everything else. */
const withErrorMapping = base.middleware(async ({ next }) => {
	try {
		return await next()
	} catch (error) {
		if (error instanceof AppError) {
			const mapped = mapAppErrorCode(error.code)
			throw new ORPCError(mapped.code, { message: error.message })
		}
		throw error
	}
})

export const publicProcedure = base.use(withErrorMapping)

export const protectedProcedure = publicProcedure.use(async ({ context, next }) => {
	if (!context.session) throw new ORPCError("UNAUTHORIZED", { message: "Authentication required" })
	return next({ context: { ...context, session: context.session } })
})

export function requireRole(...roles: AppRole[]) {
	return protectedProcedure.use(async ({ context, next }) => {
		const role = context.session?.user.role
		if (!role || !roles.includes(role)) {
			throw new ORPCError("FORBIDDEN", { message: "Insufficient permissions" })
		}
		return next()
	})
}

export const adminProcedure = requireRole("admin")

/** Narrows the nullable session to a guaranteed AuthedContext for use-case calls. */
export function toAuthedContext(context: ORPCContext): AuthedContext {
	if (!context.session) throw new ORPCError("UNAUTHORIZED", { message: "Authentication required" })
	return { headers: context.headers, session: context.session }
}
