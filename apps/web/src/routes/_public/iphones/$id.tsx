import { createFileRoute } from "@tanstack/react-router"
import { IphoneDetail } from "@web/routes/_public/iphones/_components/iphone-detail.tsx"

export const Route = createFileRoute("/_public/iphones/$id")({
	component: IphoneDetailPage,
})

function IphoneDetailPage() {
	const { id } = Route.useParams()
	return <IphoneDetail id={id} />
}
