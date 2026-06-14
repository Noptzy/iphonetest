import { formatIdr } from "@/libs/format/idr.ts"
import { PaymentProofUpload } from "./payment-proof-upload.tsx"

interface BankTransferInstructionsProps {
	orderId: string
	totalAmount: number
	onUploaded: () => void
}

const bankAccount = {
	bank: "BCA",
	number: "1234567890",
	name: "Perfect10 Store",
}

/** Shows bank transfer details so the customer knows where to send payment, then accepts the receipt upload. */
export function BankTransferInstructions({ orderId, totalAmount, onUploaded }: BankTransferInstructionsProps) {
	return (
		<div className="space-y-4">
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<p className="mb-3 text-sm font-semibold text-blue-900">Transfer Instructions</p>
				<p className="text-sm text-blue-800">
					Please transfer <span className="font-bold">{formatIdr(totalAmount)}</span> to:
				</p>
				<div className="mt-2 space-y-1 rounded bg-white p-3 text-sm">
					<p>
						<span className="text-slate-500">Bank:</span>{" "}
						<span className="font-medium">{bankAccount.bank}</span>
					</p>
					<p>
						<span className="text-slate-500">Account:</span>{" "}
						<span className="font-mono font-medium">{bankAccount.number}</span>
					</p>
					<p>
						<span className="text-slate-500">Name:</span>{" "}
						<span className="font-medium">{bankAccount.name}</span>
					</p>
					<p className="mt-2 text-slate-500">
						Amount: <span className="font-bold text-slate-900">{formatIdr(totalAmount)}</span>
					</p>
				</div>
				<p className="mt-3 text-xs text-blue-600">
					After transferring, upload your payment receipt below. Your order will be processed once payment is verified.
				</p>
			</div>

			<PaymentProofUpload orderId={orderId} onUploaded={onUploaded} />
		</div>
	)
}
