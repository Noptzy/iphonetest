import type { AnyFieldApi } from "@tanstack/react-form"

type FormFieldProps = {
	field: AnyFieldApi
	type?: "text" | "email" | "password"
	placeholder: string
}

export function FormField({ field, type = "text", placeholder }: FormFieldProps) {
	return (
		<div>
			<input
				type={type}
				placeholder={placeholder}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 transition-all"
			/>
			{field.state.meta.errors ? (
				<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
			) : null}
		</div>
	)
}