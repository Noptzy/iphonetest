import { type ReactFormExtendedApi } from "@tanstack/react-form"

// biome-ignore lint/suspicious/noExplicitAny: TanStack Form's typed API requires 12 generic params per form. This shared component must accept any form variant.
// biome-ignore lint/complexity/noBannedTypes: see above
type AnyFormApi = ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>

type SubmitButtonProps = {
	form: AnyFormApi
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