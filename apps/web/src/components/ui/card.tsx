import type { ReactNode } from "react"
import { cn } from "@/libs/cn.ts"

/** Rounded white surface with a soft shadow — Apple's product-tile look. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className={cn("rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5", className)}>
			{children}
		</div>
	)
}
