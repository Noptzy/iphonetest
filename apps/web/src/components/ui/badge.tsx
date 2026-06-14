import type { ReactNode } from "react"
import { cn } from "@/libs/cn.ts"

type Tone = "neutral" | "green" | "amber" | "blue" | "red"

const TONE_CLASS: Record<Tone, string> = {
	neutral: "bg-[#1d1d1f]/8 text-[#1d1d1f]",
	green: "bg-emerald-500/12 text-emerald-700",
	amber: "bg-amber-500/15 text-amber-700",
	blue: "bg-[#0071e3]/12 text-[#0071e3]",
	red: "bg-red-500/12 text-red-700",
}

/** Small rounded status pill used for condition and order state. */
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
				TONE_CLASS[tone],
			)}
		>
			{children}
		</span>
	)
}
