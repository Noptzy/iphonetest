import { IPHONE_LIST_CACHE_KEY, IPHONE_LIST_TTL_SECONDS, makeListIphones } from "@api/application/iphone/list-iphones.ts"
import { describe, expect, it, vi } from "vitest"

describe("makeListIphones", () => {
	it("returns cached list on cache hit without querying repo", async () => {
		const cached = [{ id: "iphone-1" }]
		const mockRepo = { listAll: vi.fn() } as unknown as Parameters<typeof makeListIphones>[0]
		const mockCache = {
			get: vi.fn().mockResolvedValue(cached),
			set: vi.fn(),
		} as unknown as Parameters<typeof makeListIphones>[1]

		const list = await makeListIphones(mockRepo, mockCache)()

		expect(list).toEqual(cached)
		expect(mockRepo.listAll).not.toHaveBeenCalled()
		expect(mockCache.get).toHaveBeenCalledWith(IPHONE_LIST_CACHE_KEY)
	})

	it("queries repo and populates cache on cache miss", async () => {
		const fromRepo = [{ id: "iphone-2" }]
		const mockRepo = {
			listAll: vi.fn().mockResolvedValue(fromRepo),
		} as unknown as Parameters<typeof makeListIphones>[0]
		const mockCache = {
			get: vi.fn().mockResolvedValue(null),
			set: vi.fn(),
		} as unknown as Parameters<typeof makeListIphones>[1]

		const list = await makeListIphones(mockRepo, mockCache)()

		expect(list).toEqual(fromRepo)
		expect(mockRepo.listAll).toHaveBeenCalled()
		expect(mockCache.set).toHaveBeenCalledWith(IPHONE_LIST_CACHE_KEY, fromRepo, IPHONE_LIST_TTL_SECONDS)
	})
})
