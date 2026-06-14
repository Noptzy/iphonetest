import { makeCreateIphone } from "@api/application/iphone/create-iphone.ts"
import { describe, expect, it, vi } from "vitest"

describe("makeCreateIphone", () => {
	it("should successfully create a new iphone", async () => {
		const mockRepo = {
			create: vi
				.fn()
				.mockResolvedValue({ id: "iphone-1", condition: "new", conditionPercentage: null }),
		} as unknown as Parameters<typeof makeCreateIphone>[0]

		const createIphone = makeCreateIphone(mockRepo)
		const result = await createIphone({ condition: "new", conditionPercentage: null } as unknown as Parameters<typeof createIphone>[0])

		expect(result.id).toBe("iphone-1")
		expect(mockRepo.create).toHaveBeenCalledWith({ condition: "new", conditionPercentage: null })
	})

	it("should validate condition percentage before creating", async () => {
		const mockRepo = { create: vi.fn() } as unknown as Parameters<typeof makeCreateIphone>[0]
		const createIphone = makeCreateIphone(mockRepo)

		expect(() => createIphone({ condition: "new", conditionPercentage: 100 } as unknown as Parameters<typeof createIphone>[0])).toThrow(
			/new iPhone must not have/,
		)
		expect(mockRepo.create).not.toHaveBeenCalled()
	})
})
