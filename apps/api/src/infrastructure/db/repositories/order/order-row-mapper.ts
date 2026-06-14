import type { Order, OrderStatus } from "@/domain/order/order.ts"
import type { order } from "@/infrastructure/db/schema.ts"

export type OrderRow = typeof order.$inferSelect

export function mapRowToOrder(row: OrderRow): Order {
	return {
		id: row.id,
		userId: row.userId,
		iphoneId: row.iphoneId,
		quantity: row.quantity,
		totalPriceIdr: row.totalPriceIdr,
		status: row.status as OrderStatus,
		proofOfTransferUrl: row.proofOfTransferUrl,
		adminNote: row.adminNote,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	}
}
