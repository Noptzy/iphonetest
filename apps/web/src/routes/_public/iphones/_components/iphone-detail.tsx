import { useNavigate, useRouter } from "@tanstack/react-router"
import { ConditionBadge } from "@web/routes/_public/iphones/_components/condition-badge.tsx"
import { useIphoneDetail } from "@web/routes/_public/iphones/_hooks/use-iphone-detail.ts"
import { useCreateOrder } from "@web/routes/_public/iphones/_hooks/use-create-order.ts"
import { formatIdr } from "@web/libs/format/idr.ts"

export function IphoneDetail({ id }: { id: string }) {
	const navigate = useNavigate()
	const user = useRouter().options.context.user
	const { data: iphone, isLoading } = useIphoneDetail(id)

	const placeOrder = useCreateOrder((data) => {
		navigate({ to: "/orders/$id", params: { id: data.id } })
	})

	if (isLoading) return <p className="text-slate-500">Loading…</p>
	if (!iphone) return <p className="text-slate-500">iPhone not found.</p>

	return (
		<div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto py-8 items-start">
			<div className="w-full md:w-1/2 flex justify-center bg-white rounded-3xl p-8 shadow-sm">
				{iphone.imageUrl ? (
					<img
						src={iphone.imageUrl}
						alt={iphone.model}
						className="w-full max-w-sm object-contain"
					/>
				) : (
					<div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
						No Image
					</div>
				)}
			</div>
			<div className="w-full md:w-1/2 flex flex-col pt-4">
				<div className="mb-2">
					<h1 className="text-4xl font-semibold tracking-tight">{iphone.model}</h1>
				</div>
				<div className="mb-6 flex items-center gap-3">
					<p className="text-lg text-slate-500 font-medium">
						{iphone.storageGb}GB · {iphone.color}
					</p>
					<ConditionBadge
						condition={iphone.condition}
						conditionPercentage={iphone.conditionPercentage}
					/>
				</div>

				<p className="text-3xl font-semibold mb-2">{formatIdr(iphone.priceIdr)}</p>
				<p className="text-sm text-slate-400 mb-8">
					{iphone.stock > 0 ? `${iphone.stock} in stock` : "Out of stock"}
				</p>

				<div className="prose prose-slate mb-10 text-[#1d1d1f] leading-relaxed whitespace-pre-line">
					{iphone.description}
				</div>

				<div className="mt-auto border-t border-slate-200 pt-8">
					{user?.role === "admin" ? (
						<div className="rounded-2xl bg-slate-100 p-6 text-center">
							<p className="text-sm text-slate-600 mb-3">Admins cannot purchase items.</p>
							<button
								type="button"
								onClick={() => navigate({ to: "/admin/iphones" })}
								className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
							>
								Go to Dashboard
							</button>
						</div>
					) : user ? (
						<button
							type="button"
							disabled={iphone.stock < 1 || placeOrder.isPending}
							onClick={() => placeOrder.mutate({ iphoneId: iphone.id, quantity: 1 })}
							className="w-full sm:w-auto rounded-full bg-[#0071e3] px-8 py-3.5 text-base font-medium text-white hover:bg-[#0077ED] transition-colors disabled:opacity-50 disabled:bg-slate-300"
						>
							{placeOrder.isPending ? "Placing order…" : "Buy now"}
						</button>
					) : (
						<div className="rounded-2xl bg-slate-100 p-6 text-center">
							<p className="text-sm text-slate-600 mb-3">Please sign in to buy this iPhone.</p>
							<button
								type="button"
								onClick={() => navigate({ to: "/auth/login" })}
								className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
							>
								Sign in
							</button>
						</div>
					)}
					{placeOrder.error ? (
						<p className="mt-4 text-sm text-red-600">{placeOrder.error.message}</p>
					) : null}
				</div>
			</div>
		</div>
	)
}
