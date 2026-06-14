import { describe, it, expect, vi } from "vitest"
import { makeConfirmOrder } from "@/application/order/confirm-order.ts"

describe("makeConfirmOrder", () => {
	it("should confirm order and deduct stock", async () => {
		const mockOrderRepo = {
			findById: vi.fn().mockResolvedValue({ id: "order-1", iphoneId: "iphone-1", quantity: 2, status: "payment_review" }),
			updateStatus: vi.fn().mockResolvedValue({ id: "order-1", status: "confirmed" }),
		} as any
		const mockIphoneRepo = {
			decreaseStock: vi.fn().mockResolvedValue(true),
		} as any

		const confirmOrder = makeConfirmOrder({ iphoneRepo: mockIphoneRepo, orderRepo: mockOrderRepo })

		const result = await confirmOrder({ id: "order-1" })

		expect(result.status).toBe("confirmed")
		expect(mockIphoneRepo.decreaseStock).toHaveBeenCalledWith("iphone-1", 2)
		expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith("order-1", "confirmed", null)
	})

	it("should fail if order not found", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue(null) } as any
		const confirmOrder = makeConfirmOrder({ iphoneRepo: {} as any, orderRepo: mockOrderRepo })

		await expect(confirmOrder({ id: "order-1" })).rejects.toThrow(/Order not found/)
	})

	it("should fail if order is not under payment review", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue({ id: "order-1", status: "pending_payment" }) } as any
		const confirmOrder = makeConfirmOrder({ iphoneRepo: {} as any, orderRepo: mockOrderRepo })

		await expect(confirmOrder({ id: "order-1" })).rejects.toThrow(/Only orders under payment review can be confirmed/)
	})

	it("should fail if not enough stock during confirmation", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue({ id: "order-1", status: "payment_review", iphoneId: "iphone-1", quantity: 2 }) } as any
		const mockIphoneRepo = { decreaseStock: vi.fn().mockResolvedValue(false) } as any
		const confirmOrder = makeConfirmOrder({ iphoneRepo: mockIphoneRepo, orderRepo: mockOrderRepo })

		await expect(confirmOrder({ id: "order-1" })).rejects.toThrow(/Not enough stock to fulfil this order/)
	})
})
