import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

/** Guards every child route: unauthenticated visitors are bounced to /login. */
export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" })
	},
	component: Outlet,
})
