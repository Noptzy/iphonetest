import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema.ts"

export type Database = ReturnType<typeof createDb>

export function createDb(connectionUrl: string) {
	const pool = new Pool({ connectionString: connectionUrl })
	return drizzle(pool, { schema })
}
