import type { ReactNode } from "react"
import { cn } from "@/libs/cn.ts"

/** Centered, width-capped content column matching Apple's roomy gutters. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("mx-auto w-full max-w-5xl px-6", className)}>{children}</div>
}
