import { useRouter } from "@tanstack/react-router"
import { Card } from "@web/components/ui/card.tsx"
import { OrderStatusBadge } from "@web/routes/_authenticated/_components/order-status-badge.tsx"
import { AdminOrderActions } from "@web/routes/_authenticated/admin/orders/_components/admin-order-actions.tsx"
import { PaymentProofUpload } from "@web/routes/_authenticated/orders/_components/payment-proof-upload.tsx"
import { useOrderDetail } from "@web/routes/_authenticated/orders/_hooks/use-order-detail.ts"
import { formatIdr } from "@web/libs/format/idr.ts"

const bankAccount = {
	bank: "BCA",
	number: "1234 5678 90",
	name: "Perfect10 Store",
}

function BankTransferInstructions({
	orderId,
	totalAmount,
	onUploaded,
}: {
	orderId: string
	totalAmount: number
	onUploaded: () => void
}) {
	return (
		<div className="mx-auto w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<Card className="relative overflow-hidden border-0 bg-white/60 p-0 backdrop-blur-xl shadow-2xl ring-1 ring-slate-900/5">
				<div className="absolute top-0 h-1.5 w-full bg-gradient-to-r from-[#0071e3] to-[#40a0ff]" />
				<div className="p-8">
					<div className="mb-8 text-center">
						<h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
							Complete Your Payment
						</h2>
						<p className="mt-2 text-sm text-slate-500">Please transfer the exact amount below</p>
					</div>

					<div className="mb-8 flex flex-col items-center justify-center rounded-2xl bg-[#f5f5f7] py-6 ring-1 ring-inset ring-slate-200/50">
						<span className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
							Total Amount
						</span>
						<span className="text-3xl font-bold tracking-tight text-[#1d1d1f]">
							{formatIdr(totalAmount)}
						</span>
					</div>

					<div className="space-y-5">
						<div className="flex flex-col gap-1">
							<span className="text-xs font-medium uppercase tracking-wider text-slate-500">
								Bank Name
							</span>
							<span className="text-base font-semibold text-[#1d1d1f]">{bankAccount.bank}</span>
						</div>
						<div className="h-px w-full bg-slate-100" />
						<div className="flex flex-col gap-1">
							<span className="text-xs font-medium uppercase tracking-wider text-slate-500">
								Account Number
							</span>
							<div className="flex items-center justify-between">
								<span className="font-mono text-xl font-medium tracking-widest text-[#1d1d1f]">
									{bankAccount.number}
								</span>
								<button
									type="button"
									className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
									title="Copy account number"
									onClick={() =>
										navigator.clipboard.writeText(bankAccount.number.replace(/\s/g, ""))
									}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										role="img"
										aria-label="Copy"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
									</svg>
								</button>
							</div>
						</div>
						<div className="h-px w-full bg-slate-100" />
						<div className="flex flex-col gap-1">
							<span className="text-xs font-medium uppercase tracking-wider text-slate-500">
								Account Holder
							</span>
							<span className="text-base font-medium text-[#1d1d1f]">{bankAccount.name}</span>
						</div>
					</div>
				</div>
				<div className="bg-slate-50 p-6 ring-1 ring-inset ring-slate-900/5">
					<PaymentProofUpload orderId={orderId} onUploaded={onUploaded} />
				</div>
			</Card>
		</div>
	)
}

export function OrderDetail({ id }: { id: string }) {
	const isAdmin = useRouter().options.context.user?.role === "admin"
	const { data: order, isLoading, refetch } = useOrderDetail(id)

	if (isLoading || !order) return <p className="text-slate-500">Loading…</p>
	const data = order
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
				<BankTransferInstructions
					orderId={data.id}
					totalAmount={data.totalPriceIdr}
					onUploaded={() => refetch()}
				/>
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
				<AdminOrderActions orderId={data.id} status={data.status} onChanged={() => refetch()} />
			) : null}
		</div>
	)
}
