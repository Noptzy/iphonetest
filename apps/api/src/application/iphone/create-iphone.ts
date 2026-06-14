import { assertConditionPercentageMatchesCondition } from "@api/application/iphone/iphone-condition-rule.ts"
import type { IphoneInput, IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"

export function makeCreateIphone(iphoneRepo: IphoneRepository) {
	return (input: IphoneInput) => {
		assertConditionPercentageMatchesCondition(input.condition, input.conditionPercentage)
		return iphoneRepo.create(input)
	}
}
