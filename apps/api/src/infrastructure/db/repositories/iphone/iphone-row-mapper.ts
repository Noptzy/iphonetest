import type { Iphone, IphoneCondition } from "@api/domain/iphone/iphone.ts"
import type { iphone } from "@api/infrastructure/db/schema.ts"

export type IphoneRow = typeof iphone.$inferSelect

export function mapRowToIphone(row: IphoneRow): Iphone {
	return {
		id: row.id,
		model: row.model,
		storageGb: row.storageGb,
		color: row.color,
		condition: row.condition as IphoneCondition,
		conditionPercentage: row.conditionPercentage,
		priceIdr: row.priceIdr,
		stock: row.stock,
		description: row.description,
		imageUrl: row.imageUrl,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	}
}
