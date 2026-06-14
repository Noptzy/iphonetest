import { sql } from "drizzle-orm"
import type { Database } from "../../client.ts"
import { iphone } from "../../schema.ts"

export function makeIphoneStockCommand(db: Database) {
	return {
		/** Atomically subtracts stock only when enough is available. Returns false if not. */
		async decreaseStock(id: string, quantity: number): Promise<boolean> {
			const result = await db
				.update(iphone)
				.set({ stock: sql`${iphone.stock} - ${quantity}`, updatedAt: new Date() })
				.where(sql`${iphone.id} = ${id} AND ${iphone.stock} >= ${quantity}`)
				.returning({ id: iphone.id })
			return result.length > 0
		},
	}
}
