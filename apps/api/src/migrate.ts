import { env } from "@api/infrastructure/config/env.ts"
import { createDb } from "@api/infrastructure/db/client.ts"
import { logger } from "@api/infrastructure/observability/logger.ts"
import { migrate } from "drizzle-orm/node-postgres/migrator"

async function runMigrations() {
	const db = createDb(env.DATABASE_URL)
	await migrate(db, { migrationsFolder: "./drizzle" })
	logger.info("Migrations applied")
	process.exit(0)
}

runMigrations().catch((error) => {
	logger.error(error, "Migration failed")
	process.exit(1)
})
