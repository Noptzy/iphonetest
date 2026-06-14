import { env } from "@api/infrastructure/config/env.ts"
import { pino } from "pino"

export const logger = pino({
	level: env.NODE_ENV === "production" ? "info" : "debug",
	transport:
		env.NODE_ENV === "production"
			? undefined
			: { target: "pino-pretty", options: { colorize: true } },
})
