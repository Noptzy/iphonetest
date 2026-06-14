import type { Session } from "@api/domain/ports/auth-service.ts"

export interface AuthedContext {
	headers: Headers
	session: Session
}

export interface OptionalAuthContext {
	headers: Headers
	session: Session | null
}
