import { createFileRoute } from "@tanstack/react-router"
import { OrderDetail } from "@web/routes/_authenticated/orders/_components/order-detail.tsx"

export const Route = createFileRoute("/_authenticated/orders/$id")({
	component: OrderDetailPage,
})

function OrderDetailPage() {
	const { id } = Route.useParams()
	return <OrderDetail id={id} />
}
