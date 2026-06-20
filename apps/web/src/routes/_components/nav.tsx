import { Link } from "@tanstack/react-router"
import type { CurrentUser } from "@web/libs/auth/use-session.ts"

export function Nav({ user, onSignOut }: { user: CurrentUser | null; onSignOut: () => void }) {
	return (
		<div className="flex items-center gap-6 text-sm font-medium text-slate-500">
			{!user && (
				<>
					<Link to="/" className="hover:text-black transition-colors">
						Catalog
					</Link>
					<Link
						to="/auth/login"
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
					<button type="button" onClick={onSignOut} className="hover:text-black transition-colors">
						Sign out
					</button>
				</>
			)}
		</div>
	)
}
