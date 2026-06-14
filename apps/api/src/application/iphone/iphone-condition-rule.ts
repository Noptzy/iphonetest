import { badRequest } from "@api/application/shared/errors.ts"
import type { IphoneCondition } from "@api/domain/iphone/iphone.ts"

export function assertConditionPercentageMatchesCondition(
	condition: IphoneCondition,
	conditionPercentage: number | null,
) {
	if (condition === "second") {
		if (conditionPercentage === null || conditionPercentage < 1 || conditionPercentage > 100) {
			throw badRequest("A second-hand iPhone needs a condition percentage between 1 and 100")
		}
	}
	if (condition === "new" && conditionPercentage !== null) {
		throw badRequest("A new iPhone must not have a condition percentage")
	}
}
