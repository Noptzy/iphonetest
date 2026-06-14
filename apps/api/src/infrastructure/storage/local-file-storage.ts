import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import { extname } from "node:path"
import type { FileStorage } from "@api/domain/ports/file-storage.ts"

export function createLocalFileStorage(uploadDir: string): FileStorage {
	return {
		async save(bytes, originalFileName) {
			await mkdir(uploadDir, { recursive: true })
			const safeExtension = extname(originalFileName).toLowerCase() || ".bin"
			const fileName = `${randomUUID()}${safeExtension}`
			await writeFile(`${uploadDir}/${fileName}`, bytes)
			return { url: `/uploads/${fileName}` }
		},
	}
}
