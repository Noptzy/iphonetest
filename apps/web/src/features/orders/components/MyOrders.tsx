import { Link } from "@tanstack/react-router"
import { OrderStatusBadge } from "@web/components/order-status-badge.tsx"
import { useMyOrders } from "@web/features/orders/queries/use-my-orders.ts"
import { formatIdr } from "@web/libs/format/idr.ts"

export function MyOrders() {
	const { data: orders, isLoading } = useMyOrders()

	if (isLoading) return <p className="text-slate-500">Loading orders…</p>
	if (!orders?.length) return <p className="text-slate-500">You have no orders yet.</p>

	return (
		<div className="max-w-4xl mx-auto py-8">
			<h1 className="mb-8 text-4xl font-semibold tracking-tight">My Orders</h1>
			<div className="space-y-4">
				{orders.map((order) => (
					<Link
						key={order.id}
						to="/orders/$id"
						params={{ id: order.id }}
						className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
					>
						<div>
							<p className="text-xl font-medium tracking-tight mb-1">
								Order #{order.id.slice(0, 8).toUpperCase()}
							</p>
							<p className="text-slate-500">
								{order.quantity} item(s) · {formatIdr(order.totalPriceIdr)}
							</p>
						</div>
						<div className="flex items-center gap-6">
							<OrderStatusBadge status={order.status} />
							<span className="text-[#0071e3] font-medium group-hover:underline hidden sm:block">
								View Details
							</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
