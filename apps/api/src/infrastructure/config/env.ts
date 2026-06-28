import { config } from "dotenv"
import { z } from "zod"

config({ path: "../../.env" })

const envSchema = z.object({
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	BETTER_AUTH_SECRET: z
		.string()
		.min(16, "BETTER_AUTH_SECRET must be at least 16 chars (use `openssl rand -hex 32`)"),
	BETTER_AUTH_URL: z.string().url().default("http://localhost:3001"),
	WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
	PORT: z.coerce.number().int().positive().default(3001),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	UPLOAD_DIR: z.string().min(1).default("./uploads"),
	REDIS_URL: z.string().min(1).default("redis://127.0.0.1:6379"),
})

function loadEnv() {
	const parsed = envSchema.safeParse(process.env)
	if (!parsed.success) {
		const issues = parsed.error.issues
			.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
			.join("\n")
		throw new Error(`Invalid environment variables:\n${issues}`)
	}
	return parsed.data
}

export const env = loadEnv()
