import { StorageClient } from ".";

export class WebStorageClient implements StorageClient {
	private storageType: "LOCAL" | "SESSION";

	constructor(storageType: "LOCAL" | "SESSION") {
		this.storageType = storageType;
	}

	get storage() {
		if (!window) {
			return;
		}
		if (this.storageType === "LOCAL") {
			return window.localStorage;
		}
		return window.sessionStorage;
	}

	public get = (key: string) => {
		const value = this.storage?.getItem(key) ?? null;
		return value;
	};

	public set = (key: string, value: string) => {
		this.storage?.setItem(key, value);
	};

	public remove = (key: string) => {
		this.storage?.removeItem(key);
	};

	public clear = () => {
		this.storage?.clear();
	};

	public static createLocalStorageClient() {
		return new WebStorageClient("LOCAL");
	}

	public static createSessionStorageClient() {
		return new WebStorageClient("SESSION");
	}
}
