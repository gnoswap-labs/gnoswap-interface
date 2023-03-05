export interface StorageClient<T = string> {
	get: (key: T) => string | null;

	set: (key: T, value: string) => void;

	remove: (key: T) => void;

	clear: () => void;
}
