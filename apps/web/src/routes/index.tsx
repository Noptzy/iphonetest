import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ConditionBadge } from "@/components/ui/condition-badge.tsx"
import { formatIdr } from "@/libs/format/idr.ts"
import { orpc } from "@/libs/orpc/client.ts"

export const Route = createFileRoute("/")({
	component: CatalogPage,
})

function CatalogPage() {
	const { data: iphones, isLoading } = useQuery(orpc.iphone.list.queryOptions())

	if (isLoading) return <p className="text-slate-500">Loading catalog…</p>

	return (
		<div className="flex flex-col items-center">
			<div className="text-center mb-12">
				<h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3">Shop iPhone</h1>
				<p className="text-lg text-slate-500">The most powerful iPhones, now available.</p>
			</div>
			
			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
				{iphones?.map((iphone) => (
					<Link
						key={iphone.id}
						to="/iphone/$id"
						params={{ id: iphone.id }}
						className="group flex flex-col items-center rounded-3xl bg-white p-8 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200/50"
					>
						<div className="mb-4 text-center">
							<h2 className="text-2xl font-semibold tracking-tight">{iphone.model}</h2>
							<p className="mt-1 text-sm text-slate-500">
								{iphone.storageGb}GB · {iphone.color}
							</p>
						</div>
						
						{iphone.imageUrl ? (
							<img src={iphone.imageUrl} alt={iphone.model} className="h-48 w-full object-contain mb-6 transition-transform group-hover:scale-105" />
						) : (
							<div className="h-48 w-full bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-300">
								No Image
							</div>
						)}

						<div className="mt-auto w-full flex flex-col items-center">
							<ConditionBadge
								condition={iphone.condition}
								conditionPercentage={iphone.conditionPercentage}
							/>
							<p className="mt-4 text-lg font-medium">{formatIdr(iphone.priceIdr)}</p>
							<span className="mt-4 rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-900 group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
								View Details
							</span>
							<p className="mt-3 text-xs text-slate-400">
								{iphone.stock > 0 ? `In Stock` : "Out of Stock"}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
