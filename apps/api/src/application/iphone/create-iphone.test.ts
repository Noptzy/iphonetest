import { describe, it, expect, vi } from "vitest"
import { makeCreateIphone } from "@/application/iphone/create-iphone.ts"

describe("makeCreateIphone", () => {
	it("should successfully create a new iphone", async () => {
		const mockRepo = {
			create: vi.fn().mockResolvedValue({ id: "iphone-1", condition: "new", conditionPercentage: null }),
		} as any

		const createIphone = makeCreateIphone(mockRepo)
		const result = await createIphone({ condition: "new", conditionPercentage: null } as any)

		expect(result.id).toBe("iphone-1")
		expect(mockRepo.create).toHaveBeenCalledWith({ condition: "new", conditionPercentage: null })
	})

	it("should validate condition percentage before creating", async () => {
		const mockRepo = { create: vi.fn() } as any
		const createIphone = makeCreateIphone(mockRepo)

		expect(() => createIphone({ condition: "new", conditionPercentage: 100 } as any)).toThrow(/new iPhone must not have/)
		expect(mockRepo.create).not.toHaveBeenCalled()
	})
})
