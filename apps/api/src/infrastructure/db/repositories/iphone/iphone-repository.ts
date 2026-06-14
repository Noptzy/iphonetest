import type { IphoneRepository } from "@api/domain/iphone/iphone-repository.ts"
import type { Database } from "@api/infrastructure/db/client.ts"
import { makeIphoneReadQueries } from "@api/infrastructure/db/repositories/iphone/iphone-read-queries.ts"
import { makeIphoneStockCommand } from "@api/infrastructure/db/repositories/iphone/iphone-stock-command.ts"
import { makeIphoneWriteCommands } from "@api/infrastructure/db/repositories/iphone/iphone-write-commands.ts"

export function createIphoneRepository(db: Database): IphoneRepository {
	return {
		...makeIphoneReadQueries(db),
		...makeIphoneWriteCommands(db),
		...makeIphoneStockCommand(db),
	}
}
