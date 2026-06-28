import { makeCreateIphone } from "@api/application/iphone/create-iphone.ts"
import { IPHONE_LIST_CACHE_KEY } from "@api/application/iphone/list-iphones.ts"
import { describe, expect, it, vi } from "vitest"

describe("makeCreateIphone", () => {
	it("should successfully create a new iphone and invalidate the list cache", async () => {
		const mockRepo = {
			create: vi
				.fn()
				.mockResolvedValue({ id: "iphone-1", condition: "new", conditionPercentage: null }),
		} as unknown as Parameters<typeof makeCreateIphone>[0]
		const mockCache = { del: vi.fn() } as unknown as Parameters<typeof makeCreateIphone>[1]

		const createIphone = makeCreateIphone(mockRepo, mockCache)
		const result = await createIphone({ condition: "new", conditionPercentage: null } as unknown as Parameters<typeof createIphone>[0])

		expect(result.id).toBe("iphone-1")
		expect(mockRepo.create).toHaveBeenCalledWith({ condition: "new", conditionPercentage: null })
		expect(mockCache.del).toHaveBeenCalledWith(IPHONE_LIST_CACHE_KEY)
	})

	it("should validate condition percentage before creating", async () => {
		const mockRepo = { create: vi.fn() } as unknown as Parameters<typeof makeCreateIphone>[0]
		const mockCache = { del: vi.fn() } as unknown as Parameters<typeof makeCreateIphone>[1]
		const createIphone = makeCreateIphone(mockRepo, mockCache)

		await expect(
			createIphone({ condition: "new", conditionPercentage: 100 } as unknown as Parameters<typeof createIphone>[0]),
		).rejects.toThrow(/new iPhone must not have/)
		expect(mockRepo.create).not.toHaveBeenCalled()
		expect(mockCache.del).not.toHaveBeenCalled()
	})
})
