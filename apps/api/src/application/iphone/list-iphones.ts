import type { IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"
import type { Cache } from "@api/domain/ports/cache.ts"

export const IPHONE_LIST_CACHE_KEY = "iphone:list:v1"
export const IPHONE_LIST_TTL_SECONDS = 60

export function makeListIphones(iphoneRepo: IphoneRepository, cache: Cache) {
	return async () => {
		const cached = await cache.get<Awaited<ReturnType<IphoneRepository["listAll"]>>>(
			IPHONE_LIST_CACHE_KEY,
		)
		if (cached) return cached

		const list = await iphoneRepo.listAll()
		await cache.set(IPHONE_LIST_CACHE_KEY, list, IPHONE_LIST_TTL_SECONDS)
		return list
	}
}
