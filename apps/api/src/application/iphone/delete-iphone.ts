import type { IphoneRepository } from "../../domain/iphone/iphone-repository.ts"
import { notFound } from "../shared/errors.ts"

export function makeDeleteIphone(iphoneRepo: IphoneRepository) {
	return async (input: { id: string }) => {
		const deleted = await iphoneRepo.delete(input.id)
		if (!deleted) throw notFound("iPhone not found")
		return { success: true as const }
	}
}
