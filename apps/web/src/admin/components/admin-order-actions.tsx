import { useState } from "react"
import { useConfirmOrder } from "@/admin/hooks/order/use-confirm-order.ts"
import { useRejectOrder } from "@/admin/hooks/order/use-reject-order.ts"
import { useCompleteOrder } from "@/admin/hooks/order/use-complete-order.ts"

interface AdminOrderActionsProps {
	orderId: string
	status: string
	onChanged: () => void
}

/** Admin controls shown on an order: confirm/reject while in review, complete once confirmed. */
export function AdminOrderActions({ orderId, status, onChanged }: AdminOrderActionsProps) {
	const [reason, setReason] = useState("")
	const confirm = useConfirmOrder(onChanged)
	const reject = useRejectOrder(onChanged)
	const complete = useCompleteOrder(onChanged)

	if (status === "payment_review") {
		return (
			<div className="space-y-3 rounded-md border border-slate-200 p-4">
				<button
					type="button"
					onClick={() => confirm.mutate({ id: orderId })}
					className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
				>
					Confirm payment
				</button>
				<div className="flex gap-2">
					<input
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Rejection reason"
						className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
					/>
					<button
						type="button"
						disabled={!reason}
						onClick={() => reject.mutate({ id: orderId, reason })}
						className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
					>
						Reject
					</button>
				</div>
			</div>
		)
	}

	if (status === "confirmed") {
		return (
			<button
				type="button"
				onClick={() => complete.mutate({ id: orderId })}
				className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
			>
				Mark as completed
			</button>
		)
	}

	return null
}
