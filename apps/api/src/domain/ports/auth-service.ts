import type { AppRole, User } from "@api/domain/user/user.ts"

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
	getSession(headers: Headers): Promise<Session | null>
	createUser(input: { name: string; email: string; password: string; role: AppRole }): Promise<User>
}
