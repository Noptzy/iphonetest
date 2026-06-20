import { z } from "zod"

export const baseIphoneSchema = z.object({
	model: z.string().min(1, "Model is required"),
	storageGb: z.coerce.number().min(1, "Storage must be at least 1 GB"),
	color: z.string().min(1, "Color is required"),
	condition: z.enum(["new", "second"]),
	conditionPercentage: z.coerce.number().min(1).max(100).nullable(),
	priceIdr: z.coerce.number().min(1, "Price must be greater than 0"),
	stock: z.coerce.number().min(0, "Stock cannot be negative"),
	description: z.string().optional(),
	imageUrl: z.string().nullable().optional(),
})

export const iphoneSchema = baseIphoneSchema.refine(
	(data) => {
		if (
			data.condition === "second" &&
			(data.conditionPercentage == null || data.conditionPercentage <= 0)
		) {
			return false
		}
		return true
	},
	{
		message: "Condition percentage is required for second hand iPhones",
		path: ["conditionPercentage"],
	},
)

export type IphoneFormValues = z.infer<typeof iphoneSchema>
