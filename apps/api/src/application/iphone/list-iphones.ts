import type { IphoneRepository } from "@/domain/iphone/iphone-repository.ts"

export function makeListIphones(iphoneRepo: IphoneRepository) {
	return () => iphoneRepo.listAll()
}
