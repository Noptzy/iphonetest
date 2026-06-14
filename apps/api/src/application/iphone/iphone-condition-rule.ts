import type { IphoneCondition } from "../../domain/iphone/iphone.ts"
import { badRequest } from "../shared/errors.ts"

/**
 * Business rule: a "second" iPhone must carry a condition percentage (1-100, e.g. 98%),
 * while a "new" iPhone must not have one.
 */
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
