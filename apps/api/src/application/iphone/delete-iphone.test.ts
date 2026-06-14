import { describe, it, expect, vi } from "vitest"
import { makeDeleteIphone } from "@/application/iphone/delete-iphone.ts"

describe("makeDeleteIphone", () => {
	it("should successfully delete an iphone", async () => {
		const mockRepo = {
			delete: vi.fn().mockResolvedValue(true),
		} as any

		const deleteIphone = makeDeleteIphone(mockRepo)
		const result = await deleteIphone({ id: "iphone-1" })

		expect(result).toEqual({ success: true })
		expect(mockRepo.delete).toHaveBeenCalledWith("iphone-1")
	})

	it("should fail if iphone not found", async () => {
		const mockRepo = {
			delete: vi.fn().mockResolvedValue(false),
		} as any

		const deleteIphone = makeDeleteIphone(mockRepo)
		await expect(deleteIphone({ id: "iphone-1" })).rejects.toThrow(/iPhone not found/)
		expect(mockRepo.delete).toHaveBeenCalledWith("iphone-1")
	})
})
