type OrderStatus =
	| "pending_payment"
	| "payment_review"
	| "confirmed"
	| "completed"
	| "rejected"
	| "cancelled"

const LABELS: Record<OrderStatus, string> = {
	pending_payment: "Awaiting payment",
	payment_review: "Payment under review",
	confirmed: "Confirmed",
	completed: "Completed",
	rejected: "Payment rejected",
	cancelled: "Cancelled",
}

const COLORS: Record<OrderStatus, string> = {
	pending_payment: "bg-amber-100 text-amber-800",
	payment_review: "bg-blue-100 text-blue-800",
	confirmed: "bg-emerald-100 text-emerald-800",
	completed: "bg-slate-200 text-slate-800",
	rejected: "bg-red-100 text-red-800",
	cancelled: "bg-slate-100 text-slate-500",
}

export function orderStatusLabel(status: string): string {
	return LABELS[status as OrderStatus] ?? status
}

export function orderStatusColor(status: string): string {
	return COLORS[status as OrderStatus] ?? "bg-slate-100 text-slate-700"
}
