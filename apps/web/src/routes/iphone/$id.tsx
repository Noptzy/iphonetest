import { createFileRoute } from "@tanstack/react-router"
import { IphoneDetail } from "@web/features/iphones/components/IphoneDetail.tsx"

export const Route = createFileRoute("/iphone/$id")({
	component: IphoneDetailPage,
})

function IphoneDetailPage() {
	const { id } = Route.useParams()
	return <IphoneDetail id={id} />
}
