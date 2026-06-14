import { desc, eq } from "drizzle-orm"
import type { Order } from "@/domain/order/order.ts"
import type { Database } from "@/infrastructure/db/client.ts"
import { order } from "@/infrastructure/db/schema.ts"
import { mapRowToOrder } from "@/infrastructure/db/repositories/order/order-row-mapper.ts"

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
