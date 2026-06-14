import { migrate } from "drizzle-orm/node-postgres/migrator"
import { createDb } from "@/infrastructure/db/client.ts"
import { env } from "@/infrastructure/config/env.ts"
import { logger } from "@/infrastructure/observability/logger.ts"

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
