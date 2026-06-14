import { describe, it, expect, vi } from "vitest"
import { makeCancelOrder } from "@/application/order/cancel-order.ts"

describe("makeCancelOrder", () => {
	const mockCtx = { session: { user: { id: "user-1", role: "user" } } } as any

	it("should successfully cancel a pending order", async () => {
		const mockOrderRepo = {
			findById: vi.fn().mockResolvedValue({ id: "order-1", status: "pending_payment", userId: "user-1" }),
			updateStatus: vi.fn().mockResolvedValue({ id: "order-1", status: "cancelled" }),
		} as any

		const cancelOrder = makeCancelOrder(mockOrderRepo)
		const result = await cancelOrder({ id: "order-1" }, mockCtx)

		expect(result.status).toBe("cancelled")
		expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith("order-1", "cancelled", null)
	})

	it("should fail if order not found", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue(null) } as any
		const cancelOrder = makeCancelOrder(mockOrderRepo)

		await expect(cancelOrder({ id: "order-1" }, mockCtx)).rejects.toThrow(/Order not found/)
	})

	it("should fail if order is not pending payment", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue({ id: "order-1", status: "confirmed", userId: "user-1" }) } as any
		const cancelOrder = makeCancelOrder(mockOrderRepo)

		await expect(cancelOrder({ id: "order-1" }, mockCtx)).rejects.toThrow(/Only orders awaiting payment can be cancelled/)
	})

	it("should fail if another user tries to cancel", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue({ id: "order-1", status: "pending_payment", userId: "user-different" }) } as any
		const cancelOrder = makeCancelOrder(mockOrderRepo)

		await expect(cancelOrder({ id: "order-1" }, mockCtx)).rejects.toThrow(/access this order/)
	})
})
