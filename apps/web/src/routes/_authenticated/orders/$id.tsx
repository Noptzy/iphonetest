import { createFileRoute } from "@tanstack/react-router"
import { OrderDetail } from "@web/features/orders/components/OrderDetail.tsx"

export const Route = createFileRoute("/_authenticated/orders/$id")({
	component: OrderDetailPage,
})

function OrderDetailPage() {
	const { id } = Route.useParams()
	return <OrderDetail id={id} />
}
