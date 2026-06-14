import { randomUUID } from "node:crypto"
import type { Iphone } from "@api/domain/iphone/iphone.ts"
import type { IphoneInput } from "@api/domain/iphone/iphone-repository.ts"
import type { Database } from "@api/infrastructure/db/client.ts"
import { mapRowToIphone } from "@api/infrastructure/db/repositories/iphone/iphone-row-mapper.ts"
import { iphone } from "@api/infrastructure/db/schema.ts"
import { eq } from "drizzle-orm"

export function makeIphoneWriteCommands(db: Database) {
	return {
		async create(input: IphoneInput): Promise<Iphone> {
			const [row] = await db
				.insert(iphone)
				.values({ id: randomUUID(), ...input })
				.returning()
			return mapRowToIphone(row!)
		},

		async update(id: string, input: Partial<IphoneInput>): Promise<Iphone | null> {
			const [row] = await db
				.update(iphone)
				.set({ ...input, updatedAt: new Date() })
				.where(eq(iphone.id, id))
				.returning()
			return row ? mapRowToIphone(row) : null
		},

		async delete(id: string): Promise<boolean> {
			const deleted = await db.delete(iphone).where(eq(iphone.id, id)).returning({ id: iphone.id })
			return deleted.length > 0
		},
	}
}
