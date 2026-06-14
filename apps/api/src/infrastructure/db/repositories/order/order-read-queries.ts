import type { Order } from "@api/domain/order/order.ts"
import type { Database } from "@api/infrastructure/db/client.ts"
import { mapRowToOrder } from "@api/infrastructure/db/repositories/order/order-row-mapper.ts"
import { order } from "@api/infrastructure/db/schema.ts"
import { desc, eq } from "drizzle-orm"

export function makeOrderReadQueries(db: Database) {
	return {
		async findById(id: string): Promise<Order | null> {
			const [row] = await db.select().from(order).where(eq(order.id, id)).limit(1)
			return row ? mapRowToOrder(row) : null
		},

		async listByUser(userId: string): Promise<Order[]> {
			const rows = await db
				.select()
				.from(order)
				.where(eq(order.userId, userId))
				.orderBy(desc(order.createdAt))
			return rows.map(mapRowToOrder)
		},

		async listAll(): Promise<Order[]> {
			const rows = await db.select().from(order).orderBy(desc(order.createdAt))
			return rows.map(mapRowToOrder)
		},
	}
}
