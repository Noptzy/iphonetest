import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_public")({
	beforeLoad: ({ context, location }) => {
		if (context.user && location.pathname.startsWith("/auth")) throw redirect({ to: "/" })
	},
	component: Outlet,
})
