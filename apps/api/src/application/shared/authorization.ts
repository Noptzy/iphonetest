import { forbidden } from "@api/application/shared/errors.ts"

export function assertNotSelf(actorId: string, targetId: string, verb: string) {
	if (actorId === targetId) throw forbidden(`Cannot ${verb} yourself`)
}
