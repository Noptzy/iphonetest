import type { AuthService, Session } from "@api/domain/ports/auth-service.ts"
import type { AppRole, User } from "@api/domain/user/user.ts"
import type { Auth } from "@api/infrastructure/auth/better-auth.ts"

export function createAuthService(auth: Auth): AuthService {
	return {
		async getSession(headers: Headers): Promise<Session | null> {
			const result = await auth.api.getSession({ headers })
			if (!result) return null
			const sessionUser = result.user as { id: string; name: string; email: string; role?: string }
			return {
				user: {
					id: sessionUser.id,
					name: sessionUser.name,
					email: sessionUser.email,
					role: (sessionUser.role as AppRole) ?? "user",
				},
			}
		},

		async createUser(input): Promise<User> {
			const created = await auth.api.signUpEmail({
				body: { name: input.name, email: input.email, password: input.password },
			})
			return {
				id: created.user.id,
				name: input.name,
				email: input.email,
				role: input.role,
				createdAt: new Date(),
			}
		},
	}
}
