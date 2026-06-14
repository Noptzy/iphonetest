export interface StoredFile {
	/** Public URL path the web app can use to display the file, e.g. /uploads/abc.png */
	url: string
}

export interface FileStorage {
	/** Persist raw bytes under a generated name and return its public URL. */
	save(bytes: Uint8Array, originalFileName: string): Promise<StoredFile>
}
