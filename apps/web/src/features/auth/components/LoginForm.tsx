import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { useLogin } from "@web/features/auth/mutations/use-login.ts"
import { loginSchema } from "@web/features/auth/schemas/auth.schema.ts"

export function LoginForm() {
	const login = useLogin()

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await login.mutateAsync(value)
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
					<h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
					<p className="text-slate-500 mt-2">Welcome back to the store.</p>
				</div>
				<div className="space-y-4">
					<form.Field
						name="email"
						validators={{ onChange: loginSchema.shape.email }}
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
						validators={{ onChange: loginSchema.shape.password }}
						children={(field) => (
							<div>
								<input
									type="password"
									placeholder="Password"
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
				{login.error ? (
					<p className="text-sm text-red-600 text-center">{login.error.message}</p>
				) : null}

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							disabled={!canSubmit || isSubmitting}
							className="w-full rounded-full bg-black px-4 py-3.5 font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
						>
							{isSubmitting ? "Signing in…" : "Sign in"}
						</button>
					)}
				/>

				<p className="text-center text-sm text-slate-500 mt-6">
					No account?{" "}
					<Link to="/auth/register" className="font-medium text-[#0071e3] hover:underline">
						Register
					</Link>
				</p>
			</form>
		</div>
	)
}
