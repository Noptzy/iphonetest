import { createFileRoute } from "@tanstack/react-router"
import { RegisterForm } from "@web/routes/_public/auth/_components/register-form.tsx"

export const Route = createFileRoute("/_public/auth/register")({
	component: RegisterPage,
})

function RegisterPage() {
	return <RegisterForm />
}
