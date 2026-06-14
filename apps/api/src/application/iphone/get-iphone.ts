import { notFound } from "@api/application/shared/errors.ts"
import type { IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"

export function makeGetIphone(iphoneRepo: IphoneRepository) {
	return async (input: { id: string }) => {
		const found = await iphoneRepo.findById(input.id)
		if (!found) throw notFound("iPhone not found")
		return found
	}
}
