import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "@web/routes/_public/auth/_components/login-form.tsx"

export const Route = createFileRoute("/_public/auth/login")({
	component: LoginPage,
})

function LoginPage() {
	return <LoginForm />
}
