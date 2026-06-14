import type { IphoneInput } from "../../domain/iphone/iphone-repository.ts"

const MODEL_NUMBERS = [10, 11, 12, 13, 14, 15, 16, 17] as const
const COLORS = ["Black", "White", "Blue", "Midnight", "Starlight"]
const STORAGE_OPTIONS = [128, 256, 512]
const SECOND_HAND_PERCENTAGES = [99, 98, 95, 90, 85]

/** Newer models cost more: base price grows ~1.5M IDR per generation. */
function newPriceForModel(modelNumber: number): number {
	return 8_000_000 + (modelNumber - 10) * 1_500_000
}

/** A second-hand unit is discounted in proportion to how far below 100% its condition is. */
function secondHandPrice(newPrice: number, conditionPercentage: number): number {
	const discountFactor = conditionPercentage / 100
	return Math.round((newPrice * discountFactor) / 100_000) * 100_000
}

function pick<T>(list: readonly T[], index: number): T {
	return list[index % list.length]!
}

/** Builds one brand-new and one second-hand listing for every iPhone model 10 through 17. */
export function buildIphoneCatalog(): IphoneInput[] {
	const catalog: IphoneInput[] = []

	MODEL_NUMBERS.forEach((modelNumber, index) => {
		const model = `iPhone ${modelNumber}`
		const newPrice = newPriceForModel(modelNumber)
		const storageGb = pick(STORAGE_OPTIONS, index)
		const color = pick(COLORS, index)

		catalog.push({
			model,
			storageGb,
			color,
			condition: "new",
			conditionPercentage: null,
			priceIdr: newPrice,
			stock: 10,
			description: `Brand new ${model}, ${storageGb}GB, ${color}. Sealed box with full warranty.`,
			imageUrl: null,
		})

		const conditionPercentage = pick(SECOND_HAND_PERCENTAGES, index)
		catalog.push({
			model,
			storageGb,
			color,
			condition: "second",
			conditionPercentage,
			priceIdr: secondHandPrice(newPrice, conditionPercentage),
			stock: 3,
			description: `Pre-owned ${model}, ${storageGb}GB, ${color}. Condition ${conditionPercentage}% — fully functional.`,
			imageUrl: null,
		})
	})

	return catalog
}
