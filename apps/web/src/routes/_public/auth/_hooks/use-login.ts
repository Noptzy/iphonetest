import { type UseMutationResult, useMutation } from "@tanstack/react-query"
import type { LoginFormValues } from "@web/routes/_public/auth/_apis/auth-schema.ts"
import { authClient } from "@web/libs/auth/client.ts"

export function useLogin(): UseMutationResult<
	NonNullable<Awaited<ReturnType<typeof authClient.signIn.email>>["data"]>,
	Error,
	LoginFormValues
> {
	return useMutation({
		mutationFn: async (data: LoginFormValues) => {
			const { data: resData, error } = await authClient.signIn.email(data)
			if (error) throw new Error(error.message ?? "Sign in failed")
			return resData
		},
		onSuccess: (data) => {
			if ((data?.user as { role?: string })?.role === "admin") {
				window.location.href = "/admin/iphones"
			} else {
				window.location.href = "/"
			}
		},
	})
}
