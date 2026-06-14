import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { authClient } from "@/libs/auth/client.ts"

export const Route = createFileRoute("/register")({
	component: RegisterPage,
})

function RegisterPage() {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	async function submit(event: React.FormEvent) {
		event.preventDefault()
		setSubmitting(true)
		setError(null)
		const { error: signUpError } = await authClient.signUp.email({ name, email, password })
		if (signUpError) {
			setError(signUpError.message ?? "Registration failed")
			setSubmitting(false)
			return
		}
		window.location.href = "/"
	}

	return (
		<div className="flex justify-center py-12 md:py-20">
			<form onSubmit={submit} className="w-full max-w-md space-y-6 bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
					<p className="text-slate-500 mt-2">Join us to start shopping.</p>
				</div>
				<div className="space-y-4">
					<input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 transition-all"
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 transition-all"
					/>
					<input
						type="password"
						placeholder="Password (min 8 chars)"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={8}
						className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 transition-all"
					/>
				</div>
				{error ? <p className="text-sm text-red-600 text-center">{error}</p> : null}
				<button
					type="submit"
					disabled={submitting}
					className="w-full rounded-full bg-black px-4 py-3.5 font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
				>
					{submitting ? "Creating…" : "Create account"}
				</button>
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
