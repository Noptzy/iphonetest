import { z } from "zod"

export const idSchema = z.object({ id: z.string().min(1) })

const conditionSchema = z.enum(["new", "second"])

export const createIphoneSchema = z.object({
	model: z.string().min(1),
	storageGb: z.number().int().positive(),
	color: z.string().min(1),
	condition: conditionSchema,
	conditionPercentage: z.number().int().min(1).max(100).nullable(),
	priceIdr: z.number().int().positive(),
	stock: z.number().int().min(0),
	description: z.string().default(""),
	imageUrl: z.string().nullable().default(null),
})

export const updateIphoneSchema = createIphoneSchema.partial().extend({ id: z.string().min(1) })

export const placeOrderSchema = z.object({
	iphoneId: z.string().min(1),
	quantity: z.number().int().positive(),
})

export const uploadProofSchema = z.object({
	orderId: z.string().min(1),
	proofOfTransferUrl: z.string().min(1),
})

export const rejectOrderSchema = z.object({
	id: z.string().min(1),
	reason: z.string().min(1),
})
