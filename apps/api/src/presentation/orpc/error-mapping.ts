import type { AppErrorCode } from "@/application/shared/errors.ts"

interface MappedError {
	code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "BAD_REQUEST" | "CONFLICT" | "INTERNAL_SERVER_ERROR"
	status: number
}

const MAP: Record<AppErrorCode, MappedError> = {
	UNAUTHORIZED: { code: "UNAUTHORIZED", status: 401 },
	FORBIDDEN: { code: "FORBIDDEN", status: 403 },
	NOT_FOUND: { code: "NOT_FOUND", status: 404 },
	BAD_REQUEST: { code: "BAD_REQUEST", status: 400 },
	CONFLICT: { code: "CONFLICT", status: 409 },
	INTERNAL_ERROR: { code: "INTERNAL_SERVER_ERROR", status: 500 },
}

export function mapAppErrorCode(code: AppErrorCode): MappedError {
	return MAP[code]
}
