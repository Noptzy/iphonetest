import type { OrderRepository } from "../../../../domain/order/order-repository.ts"
import type { Database } from "../../client.ts"
import { makeOrderReadQueries } from "./order-read-queries.ts"
import { makeOrderWriteCommands } from "./order-write-commands.ts"

export function createOrderRepository(db: Database): OrderRepository {
	return {
		...makeOrderReadQueries(db),
		...makeOrderWriteCommands(db),
	}
}
