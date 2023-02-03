import { StorageClient } from ".";

export class WebStorageClient implements StorageClient {
	private storage: Storage;

	constructor(storage: Storage) {
		this.storage = storage;
	}

	public get = (key: string) => {
		const value = this.storage.getItem(key);
		return value;
	};

	public set = (key: string, value: string) => {
		this.storage.setItem(key, value);
	};

	public remove = (key: string) => {
		this.storage.removeItem(key);
	};

	public clear = () => {
		this.storage.clear();
	};

	public static createLocalStorageClient() {
		return new WebStorageClient(localStorage);
	}

	public static createSessionStorageClient() {
		return new WebStorageClient(sessionStorage);
	}
}
