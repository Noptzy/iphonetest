import { IPHONE_LIST_CACHE_KEY } from "@api/application/iphone/list-iphones.ts"
import { notFound } from "@api/application/shared/errors.ts"
import type { IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"
import type { Cache } from "@api/domain/ports/cache.ts"

export function makeDeleteIphone(iphoneRepo: IphoneRepository, cache: Cache) {
	return async (input: { id: string }) => {
		const deleted = await iphoneRepo.delete(input.id)
		if (!deleted) throw notFound("iPhone not found")
		await cache.del(IPHONE_LIST_CACHE_KEY)
		return { success: true as const }
	}
}
