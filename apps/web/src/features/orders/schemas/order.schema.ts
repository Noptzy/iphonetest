import { z } from "zod"

export const adminOrderActionSchema = z
	.object({
		status: z.enum(["processing", "rejected"]),
		reason: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.status === "rejected" && (!data.reason || data.reason.trim() === "")) {
				return false
			}
			return true
		},
		{
			message: "Reason is required when rejecting an order",
			path: ["reason"],
		},
	)

export type AdminOrderActionValues = z.infer<typeof adminOrderActionSchema>
