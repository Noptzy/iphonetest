import * as schema from "@api/infrastructure/db/schema.ts"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

export type Database = ReturnType<typeof createDb>

export function createDb(connectionUrl: string) {
	const pool = new Pool({ connectionString: connectionUrl })
	return drizzle(pool, { schema })
}
