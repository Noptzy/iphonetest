import { type UseMutationResult, useMutation } from "@tanstack/react-query"
import type { RegisterFormValues } from "@web/features/auth/schemas/auth.schema.ts"
import { authClient } from "@web/libs/auth/client.ts"

export function useRegister(): UseMutationResult<boolean, Error, RegisterFormValues> {
	return useMutation({
		mutationFn: async (data: RegisterFormValues) => {
			const { error } = await authClient.signUp.email(data)
			if (error) throw new Error(error.message ?? "Registration failed")
			return true
		},
		onSuccess: () => {
			window.location.href = "/"
		},
	})
}
