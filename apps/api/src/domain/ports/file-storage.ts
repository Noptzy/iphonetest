export interface StoredFile {
	url: string
}

export interface FileStorage {
	save(bytes: Uint8Array, originalFileName: string): Promise<StoredFile>
}
