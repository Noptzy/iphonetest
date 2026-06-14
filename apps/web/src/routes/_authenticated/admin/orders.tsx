import { createFileRoute, Link } from "@tanstack/react-router"
import { OrderStatusBadge } from "@/components/ui/order-status-badge.tsx"
import { formatIdr } from "@/libs/format/idr.ts"
import { useAdminOrders } from "@/admin/hooks/order/use-admin-orders.ts"

export const Route = createFileRoute("/_authenticated/admin/orders")({
	component: AdminOrdersPage,
})

function AdminOrdersPage() {
	const { data: orders, isLoading } = useAdminOrders()

	if (isLoading) return <p className="text-slate-500">Loading orders…</p>
	if (!orders?.length) return <p className="text-slate-500">No orders yet.</p>

	return (
		<div className="max-w-5xl mx-auto py-8">
			<h1 className="mb-8 text-4xl font-semibold tracking-tight">All Orders</h1>
			<div className="space-y-4">
				{orders.map((order) => (
					<Link
						key={order.id}
						to="/orders/$id"
						params={{ id: order.id }}
						className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
					>
						<div>
							<p className="text-xl font-medium tracking-tight mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
							<p className="text-slate-500">{order.quantity} item(s) · {formatIdr(order.totalPriceIdr)}</p>
						</div>
						<div className="flex items-center gap-6">
							<OrderStatusBadge status={order.status} />
							<span className="text-[#0071e3] font-medium group-hover:underline hidden sm:block">Manage</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
