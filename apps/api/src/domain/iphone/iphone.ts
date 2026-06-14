export type IphoneCondition = "new" | "second"

export interface Iphone {
	id: string
	model: string
	storageGb: number
	color: string
	condition: IphoneCondition
	conditionPercentage: number | null
	priceIdr: number
	stock: number
	description: string
	imageUrl: string | null
	createdAt: Date
	updatedAt: Date
}
