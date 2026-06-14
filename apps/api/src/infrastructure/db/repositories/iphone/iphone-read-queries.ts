import { eq } from "drizzle-orm"
import type { Iphone } from "@/domain/iphone/iphone.ts"
import type { Database } from "@/infrastructure/db/client.ts"
import { iphone } from "@/infrastructure/db/schema.ts"
import { mapRowToIphone } from "@/infrastructure/db/repositories/iphone/iphone-row-mapper.ts"

export function makeIphoneReadQueries(db: Database) {
	return {
		async listAll(): Promise<Iphone[]> {
			const rows = await db.select().from(iphone).orderBy(iphone.model)
			return rows.map(mapRowToIphone)
		},

		async findById(id: string): Promise<Iphone | null> {
			const [row] = await db.select().from(iphone).where(eq(iphone.id, id)).limit(1)
			return row ? mapRowToIphone(row) : null
		},
	}
}
