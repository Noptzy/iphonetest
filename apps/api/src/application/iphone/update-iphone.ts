import { assertConditionPercentageMatchesCondition } from "@api/application/iphone/iphone-condition-rule.ts"
import { notFound } from "@api/application/shared/errors.ts"
import type { IphoneInput, IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"

export interface UpdateIphoneInput extends Partial<IphoneInput> {
	id: string
}

export function makeUpdateIphone(iphoneRepo: IphoneRepository) {
	return async (input: UpdateIphoneInput) => {
		const { id, ...changes } = input
		const existing = await iphoneRepo.findById(id)
		if (!existing) throw notFound("iPhone not found")

		const nextCondition = changes.condition ?? existing.condition
		const nextPercentage =
			changes.conditionPercentage !== undefined
				? changes.conditionPercentage
				: existing.conditionPercentage
		assertConditionPercentageMatchesCondition(nextCondition, nextPercentage)

		const updated = await iphoneRepo.update(id, changes)
		if (!updated) throw notFound("iPhone not found")
		return updated
	}
}
