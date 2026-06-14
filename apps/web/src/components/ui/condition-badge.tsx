interface ConditionBadgeProps {
	condition: string
	conditionPercentage: number | null
}

/** Shows "New" in green, or "Second · 98%" in amber for pre-owned units. */
export function ConditionBadge({ condition, conditionPercentage }: ConditionBadgeProps) {
	if (condition === "new") {
		return (
			<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
				New
			</span>
		)
	}
	return (
		<span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
			Second{conditionPercentage !== null ? ` · ${conditionPercentage}%` : ""}
		</span>
	)
}
