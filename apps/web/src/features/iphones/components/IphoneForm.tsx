import { useForm } from "@tanstack/react-form"
import type { IphoneFormValues } from "@web/features/iphones/schemas/iphone.schema.ts"
import { baseIphoneSchema } from "@web/features/iphones/schemas/iphone.schema.ts"
import { useUploadProductImage } from "@web/features/uploads/mutations/use-upload-product-image.ts"

export interface IphoneFormProps {
	initialValues: Partial<IphoneFormValues>
	submitLabel: string
	pending?: boolean
	errorMessage?: string | null
	onSubmit: (values: IphoneFormValues) => void
}

const inputClass =
	"mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"

export function IphoneForm({
	initialValues,
	submitLabel,
	pending,
	errorMessage,
	onSubmit,
}: IphoneFormProps) {
	const uploadImage = useUploadProductImage()

	const form = useForm({
		defaultValues: {
			model: initialValues.model ?? "",
			storageGb: initialValues.storageGb ?? 0,
			color: initialValues.color ?? "",
			condition: initialValues.condition ?? "new",
			conditionPercentage: initialValues.conditionPercentage ?? null,
			priceIdr: initialValues.priceIdr ?? 0,
			stock: initialValues.stock ?? 0,
			description: initialValues.description ?? "",
			imageUrl: initialValues.imageUrl ?? null,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value as IphoneFormValues)
		},
	})

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		const url = await uploadImage.mutateAsync(file)
		if (url) {
			form.setFieldValue("imageUrl", url)
		}
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
			className="w-full space-y-4"
		>
			<form.Field
				name="model"
				validators={{ onChange: baseIphoneSchema.shape.model }}
				children={(field) => (
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">Model</label>
						<input
							className={inputClass}
							placeholder="e.g. iPhone 15"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
						/>
						{field.state.meta.errors ? (
							<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
						) : null}
					</div>
				)}
			/>

			<div className="flex gap-4">
				<form.Field
					name="storageGb"
					validators={{ onChange: baseIphoneSchema.shape.storageGb }}
					children={(field) => (
						<div className="flex-1">
							<label className="mb-1 block text-sm font-medium text-slate-700">Storage (GB)</label>
							<input
								className={inputClass}
								type="number"
								min={1}
								placeholder="128"
								value={field.state.value}
								onChange={(e) => field.handleChange(Number(e.target.value))}
								onBlur={field.handleBlur}
							/>
							{field.state.meta.errors ? (
								<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
							) : null}
						</div>
					)}
				/>
				<form.Field
					name="color"
					validators={{ onChange: baseIphoneSchema.shape.color }}
					children={(field) => (
						<div className="flex-1">
							<label className="mb-1 block text-sm font-medium text-slate-700">Color</label>
							<input
								className={inputClass}
								placeholder="e.g. Midnight"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							{field.state.meta.errors ? (
								<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
							) : null}
						</div>
					)}
				/>
			</div>

			<form.Field
				name="condition"
				validators={{ onChange: baseIphoneSchema.shape.condition }}
				children={(field) => (
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">Condition</label>
						<select
							className={inputClass}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value as "new" | "second")}
							onBlur={field.handleBlur}
						>
							<option value="new">New</option>
							<option value="second">Second (pre-owned)</option>
						</select>
						{field.state.meta.errors ? (
							<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
						) : null}
					</div>
				)}
			/>

			<form.Subscribe
				selector={(state) => state.values.condition}
				children={(condition) =>
					condition === "second" ? (
						<form.Field
							name="conditionPercentage"
							validators={{ onChange: baseIphoneSchema.shape.conditionPercentage }}
							children={(field) => (
								<div>
									<label className="mb-1 block text-sm font-medium text-slate-700">
										Condition Percentage (%)
									</label>
									<input
										className={inputClass}
										type="number"
										min={1}
										max={100}
										placeholder="e.g. 98"
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										onBlur={field.handleBlur}
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

			<div className="flex gap-4">
				<form.Field
					name="priceIdr"
					validators={{ onChange: baseIphoneSchema.shape.priceIdr }}
					children={(field) => (
						<div className="flex-1">
							<label className="mb-1 block text-sm font-medium text-slate-700">Price (IDR)</label>
							<input
								className={inputClass}
								type="text"
								placeholder="e.g. 15.000.000"
								value={field.state.value ? field.state.value.toLocaleString("id-ID") : ""}
								onChange={(e) => {
									const val = e.target.value.replace(/\D/g, "")
									field.handleChange(val ? Number(val) : 0)
								}}
								onBlur={field.handleBlur}
							/>
							{field.state.meta.errors ? (
								<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
							) : null}
						</div>
					)}
				/>
				<form.Field
					name="stock"
					validators={{ onChange: baseIphoneSchema.shape.stock }}
					children={(field) => (
						<div className="flex-1">
							<label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
							<input
								className={inputClass}
								type="number"
								min={0}
								placeholder="e.g. 10"
								value={field.state.value}
								onChange={(e) => field.handleChange(Number(e.target.value))}
								onBlur={field.handleBlur}
							/>
							{field.state.meta.errors ? (
								<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
							) : null}
						</div>
					)}
				/>
			</div>

			<form.Field
				name="description"
				children={(field) => (
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
						<textarea
							className={inputClass}
							placeholder="Product description"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							rows={3}
						/>
						{field.state.meta.errors ? (
							<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
						) : null}
					</div>
				)}
			/>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-slate-700">Product Image</label>
				<form.Subscribe
					selector={(state) => state.values.imageUrl}
					children={(imageUrl) =>
						imageUrl ? (
							<div className="overflow-hidden rounded-md border border-slate-200">
								<img src={imageUrl} alt="Product" className="max-h-64 w-full object-cover" />
							</div>
						) : null
					}
				/>

				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					disabled={uploadImage.isPending}
					className="block text-sm"
				/>
				{uploadImage.isPending ? <p className="text-sm text-slate-500">Uploading…</p> : null}
				{uploadImage.error ? (
					<p className="text-sm text-red-600">{uploadImage.error.message}</p>
				) : null}
			</div>

			{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<div className="flex justify-end pt-4">
						<button
							type="submit"
							disabled={pending || !canSubmit || isSubmitting || uploadImage.isPending}
							className="rounded-md bg-slate-900 px-6 py-2.5 font-medium text-white disabled:opacity-50"
						>
							{pending || isSubmitting ? "Saving…" : submitLabel}
						</button>
					</div>
				)}
			/>
		</form>
	)
}
