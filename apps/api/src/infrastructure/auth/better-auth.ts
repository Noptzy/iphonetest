import { env } from "@api/infrastructure/config/env.ts"
import type { Database } from "@api/infrastructure/db/client.ts"
import * as schema from "@api/infrastructure/db/schema.ts"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

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
