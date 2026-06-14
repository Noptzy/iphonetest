import type { OrderRepository } from "@/domain/order/order-repository.ts"
import type { Database } from "@/infrastructure/db/client.ts"
import { makeOrderReadQueries } from "@/infrastructure/db/repositories/order/order-read-queries.ts"
import { makeOrderWriteCommands } from "@/infrastructure/db/repositories/order/order-write-commands.ts"

export function createOrderRepository(db: Database): OrderRepository {
	return {
		...makeOrderReadQueries(db),
		...makeOrderWriteCommands(db),
	}
}
