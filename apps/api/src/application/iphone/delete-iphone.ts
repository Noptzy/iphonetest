import { notFound } from "@api/application/shared/errors.ts"
import type { IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"

export function makeDeleteIphone(iphoneRepo: IphoneRepository) {
	return async (input: { id: string }) => {
		const deleted = await iphoneRepo.delete(input.id)
		if (!deleted) throw notFound("iPhone not found")
		return { success: true as const }
	}
}
