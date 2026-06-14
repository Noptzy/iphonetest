import { describe, it, expect } from "vitest"
import { cn } from "./cn.ts"

describe("cn", () => {
	it("should merge string classes", () => {
		expect(cn("foo", "bar")).toBe("foo bar")
	})

	it("should ignore falsy values", () => {
		expect(cn("foo", false, "bar", null, undefined, "", "baz")).toBe("foo bar baz")
	})

	it("should handle conditional classes", () => {
		const isTrue = true
		const isFalse = false
		expect(cn("base", isTrue && "active", isFalse && "inactive")).toBe("base active")
	})

	it("should handle empty inputs gracefully", () => {
		expect(cn()).toBe("")
	})
})
