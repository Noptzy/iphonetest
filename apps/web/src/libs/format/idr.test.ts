import { describe, expect, it } from "vitest"
import { formatIdr } from "./idr.ts"

describe("formatIdr", () => {
	it("should format number to Indonesian Rupiah currency format", () => {
		expect(formatIdr(15000000).replace(/\u00A0/g, " ")).toMatch(/Rp\s?15\.000\.000/)
	})

	it("should handle zero correctly", () => {
		expect(formatIdr(0).replace(/\u00A0/g, " ")).toMatch(/Rp\s?0/)
	})

	it("should format negative numbers correctly", () => {
		expect(formatIdr(-50000).replace(/\u00A0/g, " ")).toMatch(/-Rp\s?50\.000/)
	})
})
