import { createFileRoute } from "@tanstack/react-router"
import { MyOrders } from "@web/features/orders/components/MyOrders.tsx"

export const Route = createFileRoute("/_authenticated/orders/")({
	component: MyOrdersPage,
})

function MyOrdersPage() {
	return <MyOrders />
}
