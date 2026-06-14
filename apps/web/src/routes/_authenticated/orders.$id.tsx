import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { OrderStatusBadge } from "@/components/ui/order-status-badge.tsx"
import { formatIdr } from "@/libs/format/idr.ts"
import { orpc } from "@/libs/orpc/client.ts"
import { AdminOrderActions } from "@/admin/components/admin-order-actions.tsx"
import { BankTransferInstructions } from "@/components/bank-transfer-instructions.tsx"

export const Route = createFileRoute("/_authenticated/orders/$id")({
	component: OrderDetailPage,
})

function OrderDetailPage() {
	const { id } = Route.useParams()
	const isAdmin = useRouter().options.context.user?.role === "admin"
	const order = useQuery(orpc.order.get.queryOptions({ input: { id } }))

	if (order.isLoading || !order.data) return <p className="text-slate-500">Loading…</p>
	const data = order.data
	const awaitingPayment = data.status === "pending_payment" || data.status === "rejected"

		return (
		<div className="max-w-xl space-y-5">
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-bold">Order #{data.id.slice(0, 8)}</h1>
				<OrderStatusBadge status={data.status} />
			</div>
			<div className="rounded-lg border border-slate-200 bg-white p-4">
				<p className="text-sm text-slate-500">Quantity: {data.quantity}</p>
				<p className="text-lg font-bold">{formatIdr(data.totalPriceIdr)}</p>
				{data.adminNote ? (
					<p className="mt-2 text-sm text-red-600">Note from admin: {data.adminNote}</p>
				) : null}
			</div>

			{!isAdmin && awaitingPayment ? (
				<BankTransferInstructions orderId={data.id} totalAmount={data.totalPriceIdr} onUploaded={() => order.refetch()} />
			) : null}

			{data.proofOfTransferUrl ? (
				<div>
					<p className="mb-2 text-sm font-medium">Bukti transfer</p>
					<img
						src={data.proofOfTransferUrl}
						alt="Payment receipt"
						className="max-h-80 rounded-md border border-slate-200"
					/>
				</div>
			) : null}

			{isAdmin ? (
				<AdminOrderActions orderId={data.id} status={data.status} onChanged={() => order.refetch()} />
			) : null}
		</div>
	)
}
