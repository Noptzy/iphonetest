import { Link } from "@tanstack/react-router"

type FormFooterLinkProps = {
	prompt: string
	linkText: string
	to: string
}

export function FormFooterLink({ prompt, linkText, to }: FormFooterLinkProps) {
	return (
		<p className="text-center text-sm text-slate-500 mt-6">
			{prompt}{" "}
			<Link to={to} className="font-medium text-[#0071e3] hover:underline">
				{linkText}
			</Link>
		</p>
	)
}