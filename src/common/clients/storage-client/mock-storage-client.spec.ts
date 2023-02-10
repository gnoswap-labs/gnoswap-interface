import { MockStorageClient } from "./mock-storage-client";

const storageClient = new MockStorageClient("LOCAL");
const KEY_NAME = "KEY";

describe("get storage value", () => {
	it("empty value is success", () => {
		const value = storageClient.get(KEY_NAME);

		expect(value).toBe(null);
	});
});

describe("set storage value", () => {
	it("set value is success", () => {
		const beforeValue = storageClient.get(KEY_NAME);
		storageClient.set(KEY_NAME, "VALUE");
		const afterValue = storageClient.get(KEY_NAME);

		expect(beforeValue).toBe(null);
		expect(afterValue).toBe("VALUE");
	});
});

describe("remove storage value", () => {
	it("remove value is success", () => {
		storageClient.set(KEY_NAME, "VALUE");

		const beforeValue = storageClient.get(KEY_NAME);
		storageClient.remove(KEY_NAME);
		const afterValue = storageClient.get(KEY_NAME);

		expect(beforeValue).toBe("VALUE");
		expect(afterValue).toBe(null);
	});
});

describe("clear storage value", () => {
	it("success", () => {
		storageClient.set(KEY_NAME, "VALUE");

		const beforeValue = storageClient.get(KEY_NAME);
		storageClient.clear();
		const afterValue = storageClient.get(KEY_NAME);

		expect(beforeValue).toBe("VALUE");
		expect(afterValue).toBe(null);
	});
});

export {};
