import type { Session } from "@/domain/ports/auth-service.ts"
import type { UseCases } from "@/application/use-cases.ts"

export interface ORPCContext {
	headers: Headers
	session: Session | null
	useCases: UseCases
}
