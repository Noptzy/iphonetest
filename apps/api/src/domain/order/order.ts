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
