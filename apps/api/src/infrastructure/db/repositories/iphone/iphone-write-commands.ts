import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"
import type { Iphone } from "@/domain/iphone/iphone.ts"
import type { IphoneInput } from "@/domain/iphone/iphone-repository.ts"
import type { Database } from "@/infrastructure/db/client.ts"
import { iphone } from "@/infrastructure/db/schema.ts"
import { mapRowToIphone } from "@/infrastructure/db/repositories/iphone/iphone-row-mapper.ts"

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
