import { buildAuth } from "@api/infrastructure/auth/better-auth.ts"
import { env } from "@api/infrastructure/config/env.ts"
import { createDb } from "@api/infrastructure/db/client.ts"
import { createIphoneRepository } from "@api/infrastructure/db/repositories/iphone/iphone-repository.ts"
import { user } from "@api/infrastructure/db/schema.ts"
import { buildIphoneCatalog } from "@api/infrastructure/db/seed-data.ts"
import { logger } from "@api/infrastructure/observability/logger.ts"
import { eq } from "drizzle-orm"

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
