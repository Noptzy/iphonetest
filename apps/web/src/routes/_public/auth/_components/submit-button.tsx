import { useForm } from "@tanstack/react-form"

type SubmitButtonProps = {
	form: ReturnType<typeof useForm>
	label: string
	pendingLabel: string
}

export function SubmitButton({ form, label, pendingLabel }: SubmitButtonProps) {
	return (
		<form.Subscribe
			selector={(state) => [state.canSubmit, state.isSubmitting]}
			children={([canSubmit, isSubmitting]) => (
				<button
					type="submit"
					disabled={!canSubmit || isSubmitting}
					className="w-full rounded-full bg-black px-4 py-3.5 font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
				>
					{isSubmitting ? pendingLabel : label}
				</button>
			)}
		/>
	)
}