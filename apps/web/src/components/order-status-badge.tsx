import { orderStatusColor, orderStatusLabel } from "@web/libs/format/order-status.ts"

export function OrderStatusBadge({ status }: { status: string }) {
	return (
		<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusColor(status)}`}>
			{orderStatusLabel(status)}
		</span>
	)
}
