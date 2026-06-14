import type { UseCases } from "@api/application/use-cases.ts"
import type { Session } from "@api/domain/ports/auth-service.ts"

export interface ORPCContext {
	headers: Headers
	session: Session | null
	useCases: UseCases
}
