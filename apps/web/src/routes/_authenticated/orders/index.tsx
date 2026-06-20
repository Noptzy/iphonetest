import { createFileRoute } from "@tanstack/react-router"
import { MyOrders } from "@web/routes/_authenticated/orders/_components/my-orders.tsx"

export const Route = createFileRoute("/_authenticated/orders/")({
	component: MyOrdersPage,
})

function MyOrdersPage() {
	return <MyOrders />
}
