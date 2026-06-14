import { useState } from "react"
import { client } from "@/libs/orpc/client.ts"

interface PaymentProofUploadProps {
	orderId: string
	onUploaded: () => void
}

/** Uploads the receipt image to /api/uploads, then attaches the returned URL to the order. */
export function PaymentProofUpload({ orderId, onUploaded }: PaymentProofUploadProps) {
	const [file, setFile] = useState<File | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)

	async function submit(event: React.FormEvent) {
		event.preventDefault()
		if (!file) return
		setUploading(true)
		setError(null)
		try {
			const form = new FormData()
			form.append("file", file)
			const response = await fetch("/api/uploads/payment-proof", {
				method: "POST",
				body: form,
				credentials: "include",
			})
			if (!response.ok) throw new Error("Upload failed")
			const { url } = (await response.json()) as { url: string }
			await client.order.uploadProof({ orderId, proofOfTransferUrl: url })
			onUploaded()
		} catch (uploadError) {
			setError(uploadError instanceof Error ? uploadError.message : "Upload failed")
		} finally {
			setUploading(false)
		}
	}

	return (
		<form onSubmit={submit} className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
			<p className="text-sm font-medium">Upload bukti transfer (payment receipt)</p>
			<input
				type="file"
				accept="image/*"
				onChange={(e) => setFile(e.target.files?.[0] ?? null)}
				className="block text-sm"
			/>
			{error ? <p className="text-sm text-red-600">{error}</p> : null}
			<button
				type="submit"
				disabled={!file || uploading}
				className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				{uploading ? "Uploading…" : "Submit receipt"}
			</button>
		</form>
	)
}
