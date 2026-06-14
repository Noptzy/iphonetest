import { useState } from "react"
import { useProductImageUpload } from "@/admin/hooks/iphone/use-product-image-upload.ts"

export interface IphoneFormValues {
	model: string
	storageGb: number
	color: string
	condition: "new" | "second"
	conditionPercentage: number | null
	priceIdr: number
	stock: number
	description: string
	imageUrl: string | null
}

interface IphoneFormProps {
	initialValues: IphoneFormValues
	submitLabel: string
	pending: boolean
	errorMessage?: string
	onSubmit: (values: IphoneFormValues) => void
}

const EMPTY_VALUES: IphoneFormValues = {
	model: "",
	storageGb: 128,
	color: "",
	condition: "new",
	conditionPercentage: null,
	priceIdr: 0,
	stock: 0,
	description: "",
	imageUrl: null,
}

export function emptyIphoneFormValues(): IphoneFormValues {
	return { ...EMPTY_VALUES }
}

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2"

/** Reused by the create and edit pages; hides the percentage field unless condition is "second". */
export function IphoneForm({
	initialValues,
	submitLabel,
	pending,
	errorMessage,
	onSubmit,
}: IphoneFormProps) {
	const [values, setValues] = useState<IphoneFormValues>(initialValues)
	const { uploadImage, uploading, error: imageError } = useProductImageUpload()

	function update<K extends keyof IphoneFormValues>(key: K, value: IphoneFormValues[K]) {
		setValues((current) => ({ ...current, [key]: value }))
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		const url = await uploadImage(file)
		if (url) update("imageUrl", url)
	}

	function submit(event: React.FormEvent) {
		event.preventDefault()
		onSubmit({
			...values,
			conditionPercentage: values.condition === "second" ? values.conditionPercentage : null,
		})
	}

	return (
		<form onSubmit={submit} className="w-full space-y-4">
			<div>
				<label className="mb-1 block text-sm font-medium text-slate-700">Model</label>
				<input
					className={inputClass}
					placeholder="e.g. iPhone 15"
					value={values.model}
					onChange={(e) => update("model", e.target.value)}
					required
				/>
			</div>
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="mb-1 block text-sm font-medium text-slate-700">Storage (GB)</label>
					<input
						className={inputClass}
						type="number"
						min={1}
						placeholder="128"
						value={values.storageGb}
						onChange={(e) => update("storageGb", Number(e.target.value))}
						required
					/>
				</div>
				<div className="flex-1">
					<label className="mb-1 block text-sm font-medium text-slate-700">Color</label>
					<input
						className={inputClass}
						placeholder="e.g. Midnight"
						value={values.color}
						onChange={(e) => update("color", e.target.value)}
						required
					/>
				</div>
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium text-slate-700">Condition</label>
				<select
					className={inputClass}
					value={values.condition}
					onChange={(e) => update("condition", e.target.value as "new" | "second")}
				>
					<option value="new">New</option>
					<option value="second">Second (pre-owned)</option>
				</select>
			</div>
			{values.condition === "second" ? (
				<div>
					<label className="mb-1 block text-sm font-medium text-slate-700">Condition Percentage (%)</label>
					<input
						className={inputClass}
						type="number"
						min={1}
						max={100}
						placeholder="e.g. 98"
						value={values.conditionPercentage ?? ""}
						onChange={(e) => update("conditionPercentage", Number(e.target.value))}
						required
					/>
				</div>
			) : null}
			<div className="flex gap-4">
				<div className="flex-1">
					<label className="mb-1 block text-sm font-medium text-slate-700">Price (IDR)</label>
					<input
						className={inputClass}
						type="text"
						placeholder="e.g. 15.000.000"
						value={values.priceIdr ? values.priceIdr.toLocaleString("id-ID") : ""}
						onChange={(e) => {
							const val = e.target.value.replace(/\D/g, "")
							update("priceIdr", val ? Number(val) : 0)
						}}
						required
					/>
					<p className="mt-1 text-xs text-red-500">Price cannot be 0.</p>
				</div>
				<div className="flex-1">
					<label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
					<input
						className={inputClass}
						type="number"
						min={0}
						placeholder="e.g. 10"
						value={values.stock}
						onChange={(e) => update("stock", Number(e.target.value))}
						required
					/>
				</div>
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
				<textarea
					className={inputClass}
					placeholder="Product description"
					value={values.description}
					onChange={(e) => update("description", e.target.value)}
					rows={3}
				/>
			</div>
			{/* --- image upload --- */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-slate-700">Product Image</label>
				{values.imageUrl ? (
					<div className="overflow-hidden rounded-md border border-slate-200">
						<img src={values.imageUrl} alt="Product" className="max-h-64 w-full object-cover" />
					</div>
				) : null}
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					disabled={uploading}
					className="block text-sm"
				/>
				{uploading ? <p className="text-sm text-slate-500">Uploading…</p> : null}
				{imageError ? <p className="text-sm text-red-600">{imageError}</p> : null}
			</div>

			{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
			<div className="flex justify-end pt-4">
				<button
					type="submit"
					disabled={pending}
					className="rounded-md bg-slate-900 px-6 py-2.5 font-medium text-white disabled:opacity-50"
				>
					{pending ? "Saving…" : submitLabel}
				</button>
			</div>
		</form>
	)
}
