/** Joins truthy class names into a single string. Keeps JSX className expressions readable. */
export function cn(...classes: Array<string | false | null | undefined>): string {
	return classes.filter(Boolean).join(" ")
}
