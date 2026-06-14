import type { Iphone, IphoneCondition } from "@api/domain/iphone/iphone.ts"

export interface IphoneInput {
	model: string
	storageGb: number
	color: string
	condition: IphoneCondition
	conditionPercentage: number | null
	priceIdr: number
	stock: number
	description: string
	imageUrl: string | null
}

export interface IphoneRepository {
	listAll(): Promise<Iphone[]>
	findById(id: string): Promise<Iphone | null>
	create(input: IphoneInput): Promise<Iphone>
	update(id: string, input: Partial<IphoneInput>): Promise<Iphone | null>
	delete(id: string): Promise<boolean>
	decreaseStock(id: string, quantity: number): Promise<boolean>
}
