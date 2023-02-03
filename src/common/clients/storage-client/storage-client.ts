export interface StorageClient {
	get: (key: string) => string | null;

	set: (key: string, value: string) => void;

	remove: (key: string) => void;

	clear: () => void;
}
