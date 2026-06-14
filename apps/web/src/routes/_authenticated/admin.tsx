import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

/** Guards admin-only pages: signed-in non-admins are bounced to the catalog. */
export const Route = createFileRoute("/_authenticated/admin")({
	beforeLoad: ({ context }) => {
		if (context.user?.role !== "admin") throw redirect({ to: "/" })
	},
	component: Outlet,
})
