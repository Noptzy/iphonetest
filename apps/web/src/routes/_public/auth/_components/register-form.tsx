import { useForm } from "@tanstack/react-form"
import { useRegister } from "@web/routes/_public/auth/_hooks/use-register.ts"
import { registerSchema } from "@web/routes/_public/auth/_apis/auth-schema.ts"
import { FormError } from "@web/routes/_public/auth/_components/form-error.tsx"
import { FormField } from "@web/routes/_public/auth/_components/form-field.tsx"
import { FormFooterLink } from "@web/routes/_public/auth/_components/form-footer-link.tsx"
import { FormHeader } from "@web/routes/_public/auth/_components/form-header.tsx"
import { SubmitButton } from "@web/routes/_public/auth/_components/submit-button.tsx"

export function RegisterForm() {
	const register = useRegister()

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await register.mutateAsync(value)
		},
	})

	return (
		<div className="flex justify-center py-12 md:py-20">
			<form
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
				className="w-full max-w-md space-y-6 bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100"
			>
				<FormHeader title="Create account" subtitle="Join us to start shopping." />

				<div className="space-y-4">
					<form.Field
						name="name"
						validators={{ onChange: registerSchema.shape.name }}
						children={(field) => <FormField field={field} placeholder="Name" />}
					/>
					<form.Field
						name="email"
						validators={{ onChange: registerSchema.shape.email }}
						children={(field) => <FormField field={field} type="email" placeholder="Email" />}
					/>
					<form.Field
						name="password"
						validators={{ onChange: registerSchema.shape.password }}
						children={(field) => (
							<FormField field={field} type="password" placeholder="Password (min 8 chars)" />
						)}
					/>
				</div>

				<FormError message={register.error?.message} />

				<SubmitButton form={form} label="Create account" pendingLabel="Creating…" />

				<FormFooterLink prompt="Already registered?" linkText="Sign in" to="/auth/login" />
			</form>
		</div>
	)
}