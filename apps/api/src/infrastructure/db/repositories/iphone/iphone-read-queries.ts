import type { Iphone } from "@api/domain/iphone/iphone.ts"
import type { Database } from "@api/infrastructure/db/client.ts"
import { mapRowToIphone } from "@api/infrastructure/db/repositories/iphone/iphone-row-mapper.ts"
import { iphone } from "@api/infrastructure/db/schema.ts"
import { eq } from "drizzle-orm"

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
