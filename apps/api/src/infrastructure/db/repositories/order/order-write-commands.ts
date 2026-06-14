import { randomUUID } from "node:crypto"
import type { Order, OrderStatus } from "@api/domain/order/order.ts"
import type { CreateOrderInput } from "@api/domain/order/order-repository.ts"
import type { Database } from "@api/infrastructure/db/client.ts"
import { mapRowToOrder } from "@api/infrastructure/db/repositories/order/order-row-mapper.ts"
import { order } from "@api/infrastructure/db/schema.ts"
import { eq } from "drizzle-orm"

export function makeOrderWriteCommands(db: Database) {
	return {
		async create(input: CreateOrderInput): Promise<Order> {
			const [row] = await db
				.insert(order)
				.values({ id: randomUUID(), ...input })
				.returning()
			return mapRowToOrder(row!)
		},

		async attachProof(id: string, proofOfTransferUrl: string): Promise<Order | null> {
			const [row] = await db
				.update(order)
				.set({ proofOfTransferUrl, status: "payment_review", updatedAt: new Date() })
				.where(eq(order.id, id))
				.returning()
			return row ? mapRowToOrder(row) : null
		},

		async updateStatus(
			id: string,
			status: OrderStatus,
			adminNote: string | null,
		): Promise<Order | null> {
			const [row] = await db
				.update(order)
				.set({ status, adminNote, updatedAt: new Date() })
				.where(eq(order.id, id))
				.returning()
			return row ? mapRowToOrder(row) : null
		},
	}
}
