import type { AuthedContext } from "@api/application/shared/context.ts"
import { AppError } from "@api/application/shared/errors.ts"
import type { AppRole } from "@api/domain/user/user.ts"
import type { ORPCContext } from "@api/presentation/orpc/context.ts"
import { mapAppErrorCode } from "@api/presentation/orpc/error-mapping.ts"
import { ORPCError, os } from "@orpc/server"

const base = os.$context<ORPCContext>()

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

export function toAuthedContext(context: ORPCContext): AuthedContext {
	if (!context.session) throw new ORPCError("UNAUTHORIZED", { message: "Authentication required" })
	return { headers: context.headers, session: context.session }
}
