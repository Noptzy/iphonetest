import type { IphoneRepository } from "@/domain/iphone/iphone-repository.ts"
import type { Database } from "@/infrastructure/db/client.ts"
import { makeIphoneReadQueries } from "@/infrastructure/db/repositories/iphone/iphone-read-queries.ts"
import { makeIphoneStockCommand } from "@/infrastructure/db/repositories/iphone/iphone-stock-command.ts"
import { makeIphoneWriteCommands } from "@/infrastructure/db/repositories/iphone/iphone-write-commands.ts"

export function createIphoneRepository(db: Database): IphoneRepository {
	return {
		...makeIphoneReadQueries(db),
		...makeIphoneWriteCommands(db),
		...makeIphoneStockCommand(db),
	}
}
