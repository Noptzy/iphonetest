/** Quiet centered loading hint, matching the calm Apple tone. */
export function Spinner({ label = "Loading…" }: { label?: string }) {
	return <p className="py-16 text-center text-sm text-[#86868b]">{label}</p>
}
