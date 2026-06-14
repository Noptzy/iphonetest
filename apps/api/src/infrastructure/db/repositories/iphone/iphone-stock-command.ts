import type { Database } from "@api/infrastructure/db/client.ts"
import { iphone } from "@api/infrastructure/db/schema.ts"
import { sql } from "drizzle-orm"

export function makeIphoneStockCommand(db: Database) {
	return {
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
