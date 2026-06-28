type FormHeaderProps = {
	title: string
	subtitle: string
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
	return (
		<div className="text-center mb-8">
			<h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
			<p className="text-slate-500 mt-2">{subtitle}</p>
		</div>
	)
}