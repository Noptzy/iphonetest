import type { IphoneInput, IphoneRepository } from "../../domain/iphone/iphone-repository.ts"
import { assertConditionPercentageMatchesCondition } from "./iphone-condition-rule.ts"

export function makeCreateIphone(iphoneRepo: IphoneRepository) {
	return (input: IphoneInput) => {
		assertConditionPercentageMatchesCondition(input.condition, input.conditionPercentage)
		return iphoneRepo.create(input)
	}
}
