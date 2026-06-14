import { assertConditionPercentageMatchesCondition } from "@api/application/iphone/iphone-condition-rule.ts"
import { describe, expect, it } from "vitest"

describe("assertConditionPercentageMatchesCondition", () => {
	it("should pass for new iPhone with null percentage", () => {
		expect(() => assertConditionPercentageMatchesCondition("new", null)).not.toThrow()
	})

	it("should throw for new iPhone with a percentage", () => {
		expect(() => assertConditionPercentageMatchesCondition("new", 100)).toThrow(
			/new iPhone must not have/,
		)
	})

	it("should pass for second iPhone with valid percentage", () => {
		expect(() => assertConditionPercentageMatchesCondition("second", 85)).not.toThrow()
		expect(() => assertConditionPercentageMatchesCondition("second", 1)).not.toThrow()
		expect(() => assertConditionPercentageMatchesCondition("second", 100)).not.toThrow()
	})

	it("should throw for second iPhone with invalid percentage", () => {
		expect(() => assertConditionPercentageMatchesCondition("second", null)).toThrow(
			/second-hand iPhone needs/,
		)
		expect(() => assertConditionPercentageMatchesCondition("second", 0)).toThrow(
			/second-hand iPhone needs/,
		)
		expect(() => assertConditionPercentageMatchesCondition("second", 101)).toThrow(
			/second-hand iPhone needs/,
		)
	})
})
