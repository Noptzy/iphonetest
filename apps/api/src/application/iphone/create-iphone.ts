import { assertConditionPercentageMatchesCondition } from "@api/application/iphone/iphone-condition-rule.ts"
import { IPHONE_LIST_CACHE_KEY } from "@api/application/iphone/list-iphones.ts"
import type { IphoneInput, IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"
import type { Cache } from "@api/domain/ports/cache.ts"

export function makeCreateIphone(iphoneRepo: IphoneRepository, cache: Cache) {
	return async (input: IphoneInput) => {
		assertConditionPercentageMatchesCondition(input.condition, input.conditionPercentage)
		const created = await iphoneRepo.create(input)
		await cache.del(IPHONE_LIST_CACHE_KEY)
		return created
	}
}
