import { makeDeleteIphone } from "@api/application/iphone/delete-iphone.ts"
import { IPHONE_LIST_CACHE_KEY } from "@api/application/iphone/list-iphones.ts"
import { describe, expect, it, vi } from "vitest"

describe("makeDeleteIphone", () => {
	it("should successfully delete an iphone and invalidate the list cache", async () => {
		const mockRepo = {
			delete: vi.fn().mockResolvedValue(true),
		} as unknown as Parameters<typeof makeDeleteIphone>[0]
		const mockCache = { del: vi.fn() } as unknown as Parameters<typeof makeDeleteIphone>[1]

		const deleteIphone = makeDeleteIphone(mockRepo, mockCache)
		const result = await deleteIphone({ id: "iphone-1" })

		expect(result).toEqual({ success: true })
		expect(mockRepo.delete).toHaveBeenCalledWith("iphone-1")
		expect(mockCache.del).toHaveBeenCalledWith(IPHONE_LIST_CACHE_KEY)
	})

	it("should fail if iphone not found", async () => {
		const mockRepo = {
			delete: vi.fn().mockResolvedValue(false),
		} as unknown as Parameters<typeof makeDeleteIphone>[0]
		const mockCache = { del: vi.fn() } as unknown as Parameters<typeof makeDeleteIphone>[1]

		const deleteIphone = makeDeleteIphone(mockRepo, mockCache)
		await expect(deleteIphone({ id: "iphone-1" })).rejects.toThrow(/iPhone not found/)
		expect(mockRepo.delete).toHaveBeenCalledWith("iphone-1")
		expect(mockCache.del).not.toHaveBeenCalled()
	})
})
