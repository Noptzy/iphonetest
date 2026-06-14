import type { IphoneRepository } from "../../domain/iphone/iphone-repository.ts"
import { notFound } from "../shared/errors.ts"

export function makeGetIphone(iphoneRepo: IphoneRepository) {
	return async (input: { id: string }) => {
		const found = await iphoneRepo.findById(input.id)
		if (!found) throw notFound("iPhone not found")
		return found
	}
}
