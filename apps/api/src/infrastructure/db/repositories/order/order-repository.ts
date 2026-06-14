import type { OrderRepository } from "@api/domain/order/order-repository.ts"
import type { Database } from "@api/infrastructure/db/client.ts"
import { makeOrderReadQueries } from "@api/infrastructure/db/repositories/order/order-read-queries.ts"
import { makeOrderWriteCommands } from "@api/infrastructure/db/repositories/order/order-write-commands.ts"

export function createOrderRepository(db: Database): OrderRepository {
	return {
		...makeOrderReadQueries(db),
		...makeOrderWriteCommands(db),
	}
}
