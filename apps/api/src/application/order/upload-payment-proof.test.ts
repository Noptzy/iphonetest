import { makeUploadPaymentProof } from "@api/application/order/upload-payment-proof.ts"
import { describe, expect, it, vi } from "vitest"

describe("makeUploadPaymentProof", () => {
	const mockCtx = { session: { user: { id: "user-1", role: "user" } } } as unknown as Parameters<ReturnType<typeof makeUploadPaymentProof>>[1]

	it("should successfully attach proof and return updated order", async () => {
		const mockOrderRepo = {
			findById: vi
				.fn()
				.mockResolvedValue({ id: "order-1", status: "pending_payment", userId: "user-1" }),
			attachProof: vi
				.fn()
				.mockResolvedValue({ id: "order-1", status: "payment_review", proofOfTransferUrl: "url" }),
		} as unknown as Parameters<typeof makeUploadPaymentProof>[0]

		const uploadProof = makeUploadPaymentProof(mockOrderRepo)
		const result = await uploadProof({ orderId: "order-1", proofOfTransferUrl: "url" }, mockCtx)

		expect(result.status).toBe("payment_review")
		expect(mockOrderRepo.attachProof).toHaveBeenCalledWith("order-1", "url")
	})

	it("should allow uploading proof if status is rejected", async () => {
		const mockOrderRepo = {
			findById: vi.fn().mockResolvedValue({ id: "order-1", status: "rejected", userId: "user-1" }),
			attachProof: vi.fn().mockResolvedValue({ id: "order-1", status: "payment_review" }),
		} as unknown as Parameters<typeof makeUploadPaymentProof>[0]

		const uploadProof = makeUploadPaymentProof(mockOrderRepo)
		await expect(
			uploadProof({ orderId: "order-1", proofOfTransferUrl: "url" }, mockCtx),
		).resolves.toBeDefined()
	})

	it("should fail if order is already confirmed", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue({ id: "order-1", status: "confirmed", userId: "user-1" }) } as unknown as Parameters<typeof makeUploadPaymentProof>[0]
		const uploadProof = makeUploadPaymentProof(mockOrderRepo)

		await expect(
			uploadProof({ orderId: "order-1", proofOfTransferUrl: "url" }, mockCtx),
		).rejects.toThrow(/Payment proof can only be uploaded while awaiting payment/)
	})

	it("should fail if another user tries to upload proof", async () => {
		const mockOrderRepo = { findById: vi.fn().mockResolvedValue({ id: "order-1", status: "pending_payment", userId: "user-different" }) } as unknown as Parameters<typeof makeUploadPaymentProof>[0]
		const uploadProof = makeUploadPaymentProof(mockOrderRepo)

		await expect(
			uploadProof({ orderId: "order-1", proofOfTransferUrl: "url" }, mockCtx),
		).rejects.toThrow(/access this order/)
	})
})
