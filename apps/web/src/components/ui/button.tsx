import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/libs/cn.ts"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "sm" | "md"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant
	size?: Size
}

const VARIANT_CLASS: Record<Variant, string> = {
	primary: "bg-[#0071e3] text-white hover:bg-[#0077ed]",
	secondary: "bg-[#1d1d1f] text-white hover:bg-black",
	ghost: "bg-transparent text-[#0071e3] hover:bg-[#0071e3]/10",
	danger: "bg-[#e30000] text-white hover:bg-[#c40000]",
}

const SIZE_CLASS: Record<Size, string> = {
	sm: "px-4 py-1.5 text-sm",
	md: "px-6 py-2.5 text-base",
}

/** Apple-style pill button: fully rounded, soft hover, disabled fade. */
export function Button({ variant = "primary", size = "md", className, ...rest }: ButtonProps) {
	return (
		<button
			className={cn(
				"inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
				VARIANT_CLASS[variant],
				SIZE_CLASS[size],
				className,
			)}
			{...rest}
		/>
	)
}
