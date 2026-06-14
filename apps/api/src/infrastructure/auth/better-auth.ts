import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import type { Database } from "../db/client.ts"
import * as schema from "../db/schema.ts"
import { env } from "../config/env.ts"

export type Auth = ReturnType<typeof buildAuth>

export function buildAuth(db: Database) {
	return betterAuth({
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		trustedOrigins: [env.WEB_ORIGIN],
		database: drizzleAdapter(db, { provider: "pg", schema }),
		emailAndPassword: { enabled: true },
		user: {
			additionalFields: {
				role: { type: "string", required: false, defaultValue: "user", input: false },
			},
		},
		advanced: { database: { generateId: false } },
	})
}
