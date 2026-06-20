import { useForm } from "@tanstack/react-form"
import { Button } from "@web/components/ui/button.tsx"
import { useConfirmOrder } from "@web/routes/_authenticated/admin/orders/_hooks/use-confirm-order.ts"
import { useRejectOrder } from "@web/routes/_authenticated/admin/orders/_hooks/use-reject-order.ts"

const DEFAULT_REJECT_REASON = "No reason provided"

export function AdminOrderActions({
	orderId,
	status,
	onChanged,
}: {
	orderId: string
	status: string
	onChanged: () => void
}) {
	const confirmOrder = useConfirmOrder(onChanged)
	const rejectOrder = useRejectOrder(onChanged)
	const isPending = confirmOrder.isPending || rejectOrder.isPending
	const mutationError = confirmOrder.error ?? rejectOrder.error

	const form = useForm({
		defaultValues: {
			status: "processing" as "processing" | "rejected",
			reason: "",
		},
		onSubmit: async ({ value }) => {
			if (value.status === "processing") {
				await confirmOrder.mutateAsync({ id: orderId })
			} else {
				await rejectOrder.mutateAsync({ id: orderId, reason: value.reason || DEFAULT_REJECT_REASON })
			}
		},
	})

	if (status !== "awaiting_verification") return null

	return (
		<div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mt-8">
			<h3 className="mb-4 font-semibold text-sm uppercase tracking-wider text-slate-500">
				Admin Actions
			</h3>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
				className="flex flex-col gap-4"
			>
				<form.Field
					name="status"
					children={(field) => (
						<div>
							<select
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value as "processing" | "rejected")}
								onBlur={field.handleBlur}
								className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
							>
								<option value="processing">Approve Payment</option>
								<option value="rejected">Reject Payment</option>
							</select>
							{field.state.meta.errors ? (
								<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
							) : null}
						</div>
					)}
				/>

				<form.Subscribe
					selector={(state) => state.values.status}
					children={(actionStatus) =>
						actionStatus === "rejected" ? (
							<form.Field
								name="reason"
								children={(field) => (
									<div>
										<textarea
											placeholder="Reason for rejection…"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											rows={3}
											className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
										/>
										{field.state.meta.errors ? (
											<p className="text-xs text-red-500 mt-1">
												{field.state.meta.errors.join(", ")}
											</p>
										) : null}
									</div>
								)}
							/>
						) : null
					}
				/>

				{mutationError ? <p className="text-sm text-red-600">{mutationError.message}</p> : null}

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button type="submit" disabled={!canSubmit || isSubmitting || isPending}>
							{isSubmitting || isPending ? "Processing…" : "Submit Verification"}
						</Button>
					)}
				/>
			</form>
		</div>
	)
}
