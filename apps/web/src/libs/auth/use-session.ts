import type { AppRole } from "@saas/api"
import { authClient } from "./client.ts"

export interface CurrentUser {
	id: string
	name: string
	email: string
	role: AppRole
}

/** Fetches the active session user (or null) outside React, for router beforeLoad guards. */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
	const { data } = await authClient.getSession()
	if (!data) return null
	const sessionUser = data.user as { id: string; name: string; email: string; role?: string }
	return {
		id: sessionUser.id,
		name: sessionUser.name,
		email: sessionUser.email,
		role: (sessionUser.role as AppRole) ?? "user",
	}
}
