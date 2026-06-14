import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { authClient } from "@/libs/auth/client.ts"

export const Route = createFileRoute("/login")({
	component: LoginPage,
})

function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	async function submit(event: React.FormEvent) {
		event.preventDefault()
		setSubmitting(true)
		setError(null)
		const { data, error: signInError } = await authClient.signIn.email({ email, password })
		if (signInError) {
			setError(signInError.message ?? "Sign in failed")
			setSubmitting(false)
			return
		}
		if ((data?.user as any)?.role === "admin") {
			window.location.href = "/admin/iphones"
		} else {
			window.location.href = "/"
		}
	}

	return (
		<div className="flex justify-center py-12 md:py-20">
			<form onSubmit={submit} className="w-full max-w-md space-y-6 bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
					<p className="text-slate-500 mt-2">Welcome back to the store.</p>
				</div>
				<div className="space-y-4">
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
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 transition-all"
					/>
				</div>
				{error ? <p className="text-sm text-red-600 text-center">{error}</p> : null}
				<button
					type="submit"
					disabled={submitting}
					className="w-full rounded-full bg-black px-4 py-3.5 font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
				>
					{submitting ? "Signing in…" : "Sign in"}
				</button>
				<p className="text-center text-sm text-slate-500 mt-6">
					No account?{" "}
					<Link to="/register" className="font-medium text-[#0071e3] hover:underline">
						Register
					</Link>
				</p>
			</form>
		</div>
	)
}
