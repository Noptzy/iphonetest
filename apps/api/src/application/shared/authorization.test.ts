import { assertNotSelf } from "@api/application/shared/authorization.ts"
import { describe, expect, it } from "vitest"

describe("assertNotSelf", () => {
	it("throws forbidden when actor and target are the same", () => {
		expect(() => assertNotSelf("user-1", "user-1", "ban")).toThrow(/Cannot ban yourself/)
	})

	it("passes through when actor and target differ", () => {
		expect(() => assertNotSelf("user-1", "user-2", "ban")).not.toThrow()
	})
})
