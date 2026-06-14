import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"
import type { Order, OrderStatus } from "../../../../domain/order/order.ts"
import type { CreateOrderInput } from "../../../../domain/order/order-repository.ts"
import type { Database } from "../../client.ts"
import { order } from "../../schema.ts"
import { mapRowToOrder } from "./order-row-mapper.ts"

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
