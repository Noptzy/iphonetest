import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "@web/features/auth/components/LoginForm.tsx"

export const Route = createFileRoute("/auth/login")({
	component: LoginPage,
})

function LoginPage() {
	return <LoginForm />
}
