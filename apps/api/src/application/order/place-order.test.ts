import { makePlaceOrder } from "@api/application/order/place-order.ts"
import { describe, expect, it, vi } from "vitest"

describe("makePlaceOrder", () => {
	it("should successfully place an order", async () => {
		const mockIphoneRepo = {
			findById: vi.fn().mockResolvedValue({ id: "iphone-1", priceIdr: 1000000, stock: 5 }),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			listAll: vi.fn(),
			decreaseStock: vi.fn(),
			increaseStock: vi.fn(),
		}
		const mockOrderRepo = {
			create: vi.fn().mockResolvedValue({ id: "order-1", status: "pending_payment" }),
			findById: vi.fn(),
			listByUser: vi.fn(),
			listAll: vi.fn(),
			attachProof: vi.fn(),
			updateStatus: vi.fn(),
		}

		const placeOrder = makePlaceOrder({ iphoneRepo: mockIphoneRepo, orderRepo: mockOrderRepo })
		const ctx = {
			session: {
				user: {
					id: "user-1",
					name: "Test User",
					email: "test@example.com",
					emailVerified: true,
					role: "user" as const,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			},
		}

		const result = await placeOrder({ iphoneId: "iphone-1", quantity: 2 }, ctx as unknown as Parameters<ReturnType<typeof makePlaceOrder>>[1])

		expect(result.id).toBe("order-1")
		expect(mockIphoneRepo.findById).toHaveBeenCalledWith("iphone-1")
		expect(mockOrderRepo.create).toHaveBeenCalledWith({
			userId: "user-1",
			iphoneId: "iphone-1",
			quantity: 2,
			totalPriceIdr: 2000000,
		})
	})

	it("should fail if iphone not found", async () => {
		const mockIphoneRepo = { findById: vi.fn().mockResolvedValue(null) } as unknown as Parameters<typeof makePlaceOrder>[0]["iphoneRepo"]
		const placeOrder = makePlaceOrder({ iphoneRepo: mockIphoneRepo, orderRepo: {} as unknown as Parameters<typeof makePlaceOrder>[0]["orderRepo"] })

		await expect(placeOrder({ iphoneId: "iphone-1", quantity: 1 }, {} as unknown as Parameters<ReturnType<typeof makePlaceOrder>>[1])).rejects.toThrow(
			/iPhone not found/,
		)
	})

	it("should fail if quantity is less than 1", async () => {
		const mockIphoneRepo = {
			findById: vi.fn().mockResolvedValue({ id: "iphone-1", priceIdr: 1000000, stock: 5 }),
		} as unknown as Parameters<typeof makePlaceOrder>[0]["iphoneRepo"]
		const placeOrder = makePlaceOrder({ iphoneRepo: mockIphoneRepo, orderRepo: {} as unknown as Parameters<typeof makePlaceOrder>[0]["orderRepo"] })

		await expect(placeOrder({ iphoneId: "iphone-1", quantity: 0 }, {} as unknown as Parameters<ReturnType<typeof makePlaceOrder>>[1])).rejects.toThrow(
			/Quantity must be at least 1/,
		)
	})

	it("should fail if not enough stock", async () => {
		const mockIphoneRepo = {
			findById: vi.fn().mockResolvedValue({ id: "iphone-1", priceIdr: 1000000, stock: 2 }),
		} as unknown as Parameters<typeof makePlaceOrder>[0]["iphoneRepo"]
		const placeOrder = makePlaceOrder({ iphoneRepo: mockIphoneRepo, orderRepo: {} as unknown as Parameters<typeof makePlaceOrder>[0]["orderRepo"] })

		await expect(placeOrder({ iphoneId: "iphone-1", quantity: 3 }, {} as unknown as Parameters<ReturnType<typeof makePlaceOrder>>[1])).rejects.toThrow(
			/Not enough stock available/,
		)
	})
})
