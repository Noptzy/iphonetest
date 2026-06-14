import { cn } from "@web/libs/cn.ts"
import type { ReactNode } from "react"

export function Container({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("mx-auto w-full max-w-5xl px-6", className)}>{children}</div>
}
