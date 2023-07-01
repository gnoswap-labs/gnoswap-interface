import { StorageClient } from ".";

export class MockStorageClient implements StorageClient {
  private memories: { [key in string]: string };

  private storageType: "LOCAL" | "SESSION";

  constructor(storageType: "LOCAL" | "SESSION") {
    this.storageType = storageType;
    this.memories = {};
  }

  get storage() {
    return this.memories;
  }

  public get = (key: string) => {
    const value = this.storage[key] ?? null;
    return value;
  };

  public set = (key: string, value: string) => {
    this.memories = {
      ...this.memories,
      [key]: value,
    };
  };

  public remove = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...remains } = this.memories;
    this.memories = {
      ...remains,
    };
  };

  public clear = () => {
    this.memories = {};
  };

  public static createLocalStorageClient() {
    return new MockStorageClient("LOCAL");
  }

  public static createSessionStorageClient() {
    return new MockStorageClient("SESSION");
  }
}
