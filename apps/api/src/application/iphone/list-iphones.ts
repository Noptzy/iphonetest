import type { IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"

export function makeListIphones(iphoneRepo: IphoneRepository) {
	return () => iphoneRepo.listAll()
}
