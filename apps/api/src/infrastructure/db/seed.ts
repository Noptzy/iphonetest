import { eq } from "drizzle-orm"
import { buildAuth } from "@/infrastructure/auth/better-auth.ts"
import { env } from "@/infrastructure/config/env.ts"
import { logger } from "@/infrastructure/observability/logger.ts"
import { createDb } from "@/infrastructure/db/client.ts"
import { createIphoneRepository } from "@/infrastructure/db/repositories/iphone/iphone-repository.ts"
import { buildIphoneCatalog } from "@/infrastructure/db/seed-data.ts"
import { user } from "@/infrastructure/db/schema.ts"

const db = createDb(env.DATABASE_URL)
const auth = buildAuth(db)
const iphoneRepo = createIphoneRepository(db)

interface SeedAccount {
	name: string
	email: string
	password: string
	role: "admin" | "user"
}

const ACCOUNTS: SeedAccount[] = [
	{ name: "Admin", email: "admin@iphone.test", password: "admin12345", role: "admin" },
	{ name: "Buyer", email: "user@iphone.test", password: "user12345", role: "user" },
]

/** Creates the account if missing, then forces its role. Safe to re-run. */
async function ensureAccount(account: SeedAccount) {
	const [existing] = await db.select().from(user).where(eq(user.email, account.email)).limit(1)
	if (!existing) {
		await auth.api.signUpEmail({
			body: { name: account.name, email: account.email, password: account.password },
		})
	}
	await db.update(user).set({ role: account.role }).where(eq(user.email, account.email))
	logger.info(`Account ready: ${account.email} (${account.role})`)
}

/** Inserts the catalog only when the table is empty, so re-running does not duplicate rows. */
async function ensureCatalog() {
	const existing = await iphoneRepo.listAll()
	if (existing.length > 0) {
		logger.info(`Catalog already has ${existing.length} iPhones, skipping`)
		return
	}
	const catalog = buildIphoneCatalog()
	for (const item of catalog) {
		await iphoneRepo.create(item)
	}
	logger.info(`Seeded ${catalog.length} iPhones`)
}

async function seed() {
	for (const account of ACCOUNTS) {
		await ensureAccount(account)
	}
	await ensureCatalog()
	logger.info("Seed complete")
	process.exit(0)
}

seed().catch((error) => {
	logger.error(error, "Seed failed")
	process.exit(1)
})
