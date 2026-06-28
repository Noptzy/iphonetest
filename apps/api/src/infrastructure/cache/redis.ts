import type { Cache } from "@api/domain/ports/cache.ts"
import { Redis } from "ioredis"

export function createRedisCache(url: string): Cache {
	const client = new Redis(url, { lazyConnect: true })

	return {
		async get<T>(key: string) {
			const raw = await client.get(key)
			return raw ? (JSON.parse(raw) as T) : null
		},
		async set(key, value, ttlSeconds) {
			await client.set(key, JSON.stringify(value), "EX", ttlSeconds)
		},
		async del(...keys) {
			if (keys.length === 0) return
			await client.del(...keys)
		},
		async ping() {
			await client.ping()
		},
	}
}
