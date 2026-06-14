export type AppRole = "admin" | "user"

export interface User {
	id: string
	name: string
	email: string
	role: AppRole
	createdAt: Date
}
