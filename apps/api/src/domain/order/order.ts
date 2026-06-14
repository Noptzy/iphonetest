/**
 * pending_payment  -> order created, waiting for the buyer to upload a transfer receipt
 * payment_review   -> buyer uploaded "bukti transfer", waiting for admin review
 * confirmed        -> admin verified the transfer, order is being fulfilled
 * completed        -> order fulfilled and closed
 * rejected         -> admin rejected the transfer proof (e.g. wrong amount)
 * cancelled        -> buyer cancelled before any payment proof was uploaded
 */
export type OrderStatus =
	| "pending_payment"
	| "payment_review"
	| "confirmed"
	| "completed"
	| "rejected"
	| "cancelled"

export interface Order {
	id: string
	userId: string
	iphoneId: string
	quantity: number
	totalPriceIdr: number
	status: OrderStatus
	proofOfTransferUrl: string | null
	adminNote: string | null
	createdAt: Date
	updatedAt: Date
}
