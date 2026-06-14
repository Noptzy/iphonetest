import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useRegister } from "@web/features/auth/mutations/use-register.ts"
import { registerSchema } from "@web/features/auth/schemas/auth.schema.ts"

export const Route = createFileRoute("/register")({
	component: RegisterPage,
})

function RegisterPage() {
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
				<div className="text-center mb-8">
					<h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
					<p className="text-slate-500 mt-2">Join us to start shopping.</p>
				</div>
				<div className="space-y-4">
					<form.Field
						name="name"
						validators={{ onChange: registerSchema.shape.name }}
						children={(field) => (
							<div>
								<input
									placeholder="Name"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 transition-all"
								/>
								{field.state.meta.errors ? (
									<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
								) : null}
							</div>
						)}
					/>
					<form.Field
						name="email"
						validators={{ onChange: registerSchema.shape.email }}
						children={(field) => (
							<div>
								<input
									type="email"
									placeholder="Email"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 transition-all"
								/>
								{field.state.meta.errors ? (
									<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
								) : null}
							</div>
						)}
					/>
					<form.Field
						name="password"
						validators={{ onChange: registerSchema.shape.password }}
						children={(field) => (
							<div>
								<input
									type="password"
									placeholder="Password (min 8 chars)"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 transition-all"
								/>
								{field.state.meta.errors ? (
									<p className="text-xs text-red-500 mt-1">{field.state.meta.errors.join(", ")}</p>
								) : null}
							</div>
						)}
					/>
				</div>
				{register.error ? (
					<p className="text-sm text-red-600 text-center">{register.error.message}</p>
				) : null}

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							disabled={!canSubmit || isSubmitting}
							className="w-full rounded-full bg-black px-4 py-3.5 font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
						>
							{isSubmitting ? "Creating…" : "Create account"}
						</button>
					)}
				/>

				<p className="text-center text-sm text-slate-500 mt-6">
					Already registered?{" "}
					<Link to="/login" className="font-medium text-[#0071e3] hover:underline">
						Sign in
					</Link>
				</p>
			</form>
		</div>
	)
}
