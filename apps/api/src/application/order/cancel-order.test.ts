import { makeCancelOrder } from "@api/application/order/cancel-order.ts"
import { describe, expect, it, vi } from "vitest"

describe("makeCancelOrder", () => {
	const mockCtx = { session: { user: { id: "user-1", role: "user" } } } as unknown as Parameters<ReturnType<typeof makeCancelOrder>>[1]

	it("should successfully cancel a pending order", async () => {
		const mockOrderRepo = {
			findById: vi
				.fn()
				.mockResolvedValue({ id: "order-1", status: "pending_payment", userId: "user-1" }),
			updateStatus: vi.fn().mockResolvedValue({ id: "order-1", status: "cancelled" }),
		} as unknown as Parameters<typeof makeCancelOrder>[0]

		const cancelOrder = makeCancelOrder(mockOrderRepo)
		const result = await cancelOrder({ id: "order-1" }, mockCtx)

		expect(result.status).toBe("cancelled")
		expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith("order-1", "cancelled", null)
	})

	it("should fail if order not found", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue(null) } as unknown as Parameters<typeof makeCancelOrder>[0]
		const cancelOrder = makeCancelOrder(mockOrderRepo)

		await expect(cancelOrder({ id: "order-1" }, mockCtx)).rejects.toThrow(/Order not found/)
	})

	it("should fail if order is not pending payment", async () => {
		const mockOrderRepo = {
			findById: vi.fn().mockResolvedValue({ id: "order-1", status: "confirmed", userId: "user-1" }),
		} as unknown as Parameters<typeof makeCancelOrder>[0]
		const cancelOrder = makeCancelOrder(mockOrderRepo)

		await expect(cancelOrder({ id: "order-1" }, mockCtx)).rejects.toThrow(
			/Only orders awaiting payment can be cancelled/,
		)
	})

	it("should fail if another user tries to cancel", async () => {
		const mockOrderRepo = {
			findById: vi
				.fn()
				.mockResolvedValue({ id: "order-1", status: "pending_payment", userId: "user-different" }),
		} as unknown as Parameters<typeof makeCancelOrder>[0]
		const cancelOrder = makeCancelOrder(mockOrderRepo)

		await expect(cancelOrder({ id: "order-1" }, mockCtx)).rejects.toThrow(/access this order/)
	})
})
