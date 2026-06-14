import type { AppRole, User } from "@/domain/user/user.ts"

export interface SessionUser {
	id: string
	name: string
	email: string
	role: AppRole
}

export interface Session {
	user: SessionUser
}

export interface AuthService {
	/** Resolve the current session from request headers, or null if unauthenticated. */
	getSession(headers: Headers): Promise<Session | null>
	/** Create a user directly (used by the seed script). Returns the created user. */
	createUser(input: { name: string; email: string; password: string; role: AppRole }): Promise<User>
}
