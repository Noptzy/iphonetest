import type { IphoneRepository } from "../../../../domain/iphone/iphone-repository.ts"
import type { Database } from "../../client.ts"
import { makeIphoneReadQueries } from "./iphone-read-queries.ts"
import { makeIphoneStockCommand } from "./iphone-stock-command.ts"
import { makeIphoneWriteCommands } from "./iphone-write-commands.ts"

export function createIphoneRepository(db: Database): IphoneRepository {
	return {
		...makeIphoneReadQueries(db),
		...makeIphoneWriteCommands(db),
		...makeIphoneStockCommand(db),
	}
}
