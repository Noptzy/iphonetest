export type IphoneCondition = "new" | "second"

export interface Iphone {
	id: string
	model: string
	storageGb: number
	color: string
	condition: IphoneCondition
	/** Only set when condition is "second", a value from 1-100 representing physical/battery health. */
	conditionPercentage: number | null
	priceIdr: number
	stock: number
	description: string
	imageUrl: string | null
	createdAt: Date
	updatedAt: Date
}
