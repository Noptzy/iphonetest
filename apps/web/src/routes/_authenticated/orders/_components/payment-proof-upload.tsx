import { useForm } from "@tanstack/react-form"
import { Button } from "@web/components/ui/button.tsx"
import { useUploadPaymentProof } from "@web/routes/_authenticated/orders/_hooks/use-upload-payment-proof.ts"

export function PaymentProofUpload({
	orderId,
	onUploaded,
}: {
	orderId: string
	onUploaded: () => void
}) {
	const uploadProof = useUploadPaymentProof(orderId, onUploaded)

	const form = useForm({
		defaultValues: {
			file: null as File | null,
		},
		onSubmit: async ({ value }) => {
			if (!value.file) return
			await uploadProof.mutateAsync(value.file)
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
			className="flex flex-col gap-4"
		>
			<div className="text-center">
				<h3 className="text-sm font-semibold text-[#1d1d1f]">Upload Payment Receipt</h3>
				<p className="mt-1 text-xs text-slate-500">We'll verify your payment shortly</p>
			</div>

			<form.Field
				name="file"
				children={(field) => (
					<div className="relative mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 p-6 transition-all focus-within:border-[#0071e3] focus-within:ring-2 focus-within:ring-[#0071e3]/20">
						<input
							type="file"
							accept="image/*"
							required
							onChange={(e) => {
								const f = e.target.files?.[0]
								if (f) field.handleChange(f)
							}}
							className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
						/>
						<div className="flex flex-col items-center justify-center text-center pointer-events-none">
							<div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									role="img"
									aria-label="Upload icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
									<polyline points="17 8 12 3 7 8"></polyline>
									<line x1="12" y1="3" x2="12" y2="15"></line>
								</svg>
							</div>
							<p className="text-sm font-medium text-[#0071e3]">
								{field.state.value ? field.state.value.name : "Click to select file"}
							</p>
							<p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">
								PNG, JPG up to 5MB
							</p>
						</div>
					</div>
				)}
			/>

			{uploadProof.error && (
				<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 ring-1 ring-inset ring-red-500/20 text-center animate-in slide-in-from-top-1">
					{uploadProof.error.message}
				</div>
			)}

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<Button
						type="submit"
						disabled={!canSubmit || isSubmitting || uploadProof.isPending}
						className="w-full shadow-sm"
					>
						{isSubmitting || uploadProof.isPending
							? "Uploading Receipt..."
							: "Submit Payment Receipt"}
					</Button>
				)}
			/>
		</form>
	)
}
