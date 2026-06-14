import { createRootRouteWithContext, Link, Outlet, useRouter } from "@tanstack/react-router"
import { authClient } from "@web/libs/auth/client.ts"
import type { RouterContext } from "@web/router.tsx"

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
})

function RootLayout() {
	const { options } = useRouter()
	const user = options.context.user

	async function signOut() {
		await authClient.signOut()
		window.location.href = "/"
	}

	return (
		<div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans flex flex-col">
			<header className="sticky top-0 z-50 bg-[#f5f5f7]/80 backdrop-blur-lg border-b border-slate-200/50">
				<nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
					<Link
						to="/"
						className="text-xl font-semibold tracking-tight hover:text-black transition-colors"
					>
						iPhone Marketplace
					</Link>
					<div className="flex items-center gap-6 text-sm font-medium text-slate-500">
						{!user && (
							<>
								<Link to="/" className="hover:text-black transition-colors">
									Catalog
								</Link>
								<Link
									to="/login"
									className="rounded-full bg-black px-4 py-1.5 text-white hover:bg-slate-800 transition-colors"
								>
									Sign in
								</Link>
							</>
						)}
						{user?.role === "user" && (
							<>
								<Link to="/" className="hover:text-black transition-colors">
									Catalog
								</Link>
								<Link to="/orders" className="hover:text-black transition-colors">
									My Orders
								</Link>
							</>
						)}
						{user?.role === "admin" && (
							<>
								<Link to="/admin/iphones" className="hover:text-black transition-colors">
									Manage iPhones
								</Link>
								<Link to="/admin/orders" className="hover:text-black transition-colors">
									All Orders
								</Link>
							</>
						)}
						{user && (
							<>
								<span className="text-slate-400">|</span>
								<span className="text-[#1d1d1f]">{user.name}</span>
								<button
									type="button"
									onClick={signOut}
									className="hover:text-black transition-colors"
								>
									Sign out
								</button>
							</>
						)}
					</div>
				</nav>
			</header>
			<main className="mx-auto flex-1 w-full max-w-6xl px-6 py-12">
				<Outlet />
			</main>
		</div>
	)
}
