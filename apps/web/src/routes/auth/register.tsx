import { createFileRoute } from "@tanstack/react-router"
import { RegisterForm } from "@web/features/auth/components/RegisterForm.tsx"

export const Route = createFileRoute("/auth/register")({
	component: RegisterPage,
})

function RegisterPage() {
	return <RegisterForm />
}
