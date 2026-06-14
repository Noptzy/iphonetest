import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { ConditionBadge } from "@/components/ui/condition-badge.tsx"
import { formatIdr } from "@/libs/format/idr.ts"
import { useAdminIphones } from "@/admin/hooks/iphone/use-admin-iphones.ts"
import { useDeleteIphone } from "@/admin/hooks/iphone/use-delete-iphone.ts"
import { useCreateIphone } from "@/admin/hooks/iphone/use-create-iphone.ts"
import { useUpdateIphone } from "@/admin/hooks/iphone/use-update-iphone.ts"
import { IphoneForm, emptyIphoneFormValues } from "@/admin/components/iphone-form.tsx"

export const Route = createFileRoute("/_authenticated/admin/iphones/")({
	component: AdminIphonesPage,
})

function AdminIphonesPage() {
	const list = useAdminIphones()
	const remove = useDeleteIphone(() => list.refetch())

	const [editingId, setEditingId] = useState<string | null | "new">(null)

	const close = () => setEditingId(null)
	
	const create = useCreateIphone(() => {
		list.refetch()
		close()
	})
	
	const update = useUpdateIphone(() => {
		list.refetch()
		close()
	})

	const editingIphone = editingId && editingId !== "new" 
		? list.data?.find(i => i.id === editingId) 
		: null

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Manage iPhones</h1>
				<button
					onClick={() => setEditingId("new")}
					className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
				>
					Add iPhone
				</button>
			</div>
			
			<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
				<table className="w-full text-left text-sm">
					<thead className="bg-slate-50 text-slate-500">
						<tr>
							<th className="px-4 py-2">Model</th>
							<th className="px-4 py-2">Condition</th>
							<th className="px-4 py-2">Price</th>
							<th className="px-4 py-2">Stock</th>
							<th className="px-4 py-2 text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{list.data?.map((iphone) => (
							<tr key={iphone.id} className="border-t border-slate-100">
								<td className="px-4 py-2">
									{iphone.model} · {iphone.storageGb}GB · {iphone.color}
								</td>
								<td className="px-4 py-2">
									<ConditionBadge
										condition={iphone.condition}
										conditionPercentage={iphone.conditionPercentage}
									/>
								</td>
								<td className="px-4 py-2">{formatIdr(iphone.priceIdr)}</td>
								<td className="px-4 py-2">{iphone.stock}</td>
								<td className="px-4 py-2 text-right">
									<button
										onClick={() => setEditingId(iphone.id)}
										className="mr-3 font-medium text-slate-600 hover:text-slate-900 hover:underline"
									>
										Edit
									</button>
									<button
										onClick={() => {
											if (confirm("Are you sure you want to delete this iPhone?")) {
												remove.mutate({ id: iphone.id })
											}
										}}
										className="font-medium text-red-600 hover:text-red-800 hover:underline"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{editingId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
					<div 
						className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200"
					>
						<button 
							onClick={close}
							className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg leading-none"
							title="Close"
						>
							✕
						</button>
						<h2 className="text-xl font-bold mb-4">
							{editingId === "new" ? "Add New iPhone" : "Edit iPhone"}
						</h2>
						<IphoneForm
							initialValues={
								editingIphone
									? {
											model: editingIphone.model,
											storageGb: editingIphone.storageGb,
											color: editingIphone.color,
											condition: editingIphone.condition as "new" | "second",
											conditionPercentage: editingIphone.conditionPercentage,
											priceIdr: editingIphone.priceIdr,
											stock: editingIphone.stock,
											description: editingIphone.description,
											imageUrl: editingIphone.imageUrl,
									  }
									: emptyIphoneFormValues()
							}
							submitLabel={editingId === "new" ? "Create iPhone" : "Update iPhone"}
							pending={editingId === "new" ? create.isPending : update.isPending}
							errorMessage={editingId === "new" ? create.error?.message : update.error?.message}
							onSubmit={(values) => {
								if (editingId === "new") {
									create.mutate(values)
								} else {
									update.mutate({ id: editingId, ...values })
								}
							}}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
