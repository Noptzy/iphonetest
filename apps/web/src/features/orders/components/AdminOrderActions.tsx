import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@web/components/button.tsx"
import type { AdminOrderActionValues } from "@web/features/orders/schemas/order.schema.ts"
import { client } from "@web/libs/orpc/client.ts"

export function AdminOrderActions({
	orderId,
	status,
	onChanged,
}: {
	orderId: string
	status: string
	onChanged: () => void
}) {
	const updateStatus = useMutation({
		mutationFn: async (values: AdminOrderActionValues) => {
			if (values.status === "processing") {
				await client.order.confirm({ id: orderId })
			} else {
				await client.order.reject({ id: orderId, reason: values.reason ?? "No reason provided" })
			}
		},
		onSuccess: () => {
			onChanged()
		},
	})

	const form = useForm({
		defaultValues: {
			status: "processing" as "processing" | "rejected",
			reason: "",
		},
		onSubmit: async ({ value }) => {
			await updateStatus.mutateAsync(value)
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

				{updateStatus.error ? (
					<p className="text-sm text-red-600">{updateStatus.error.message}</p>
				) : null}

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button type="submit" disabled={!canSubmit || isSubmitting || updateStatus.isPending}>
							{isSubmitting || updateStatus.isPending ? "Processing…" : "Submit Verification"}
						</Button>
					)}
				/>
			</form>
		</div>
	)
}
