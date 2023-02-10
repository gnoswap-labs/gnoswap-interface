import { AccountService } from "./account-service";
import {
	AccountRepository,
	AccountRepositoryMock,
} from "@/repositories/account";
import { StorageClient } from "@/common/clients/storage-client";
import { MockStorageClient } from "@/common/clients/storage-client/mock-storage-client";

let localStorageClient: StorageClient;
let accountRepository: AccountRepository;
let accountService: AccountService;

beforeEach(() => {
	localStorageClient = new MockStorageClient("LOCAL");
	accountRepository = new AccountRepositoryMock(localStorageClient);
	accountService = new AccountService(accountRepository);
	jest.clearAllMocks();
});

describe("get account info", () => {
	it("Successful connection to account", async () => {
		const spyFnGetAccountInfo = jest.spyOn(accountRepository, "getAccount");
		const accountInfo = await accountService.getAccountInfo();

		expect(accountInfo).toBeTruthy();
		expect(spyFnGetAccountInfo).toBeCalledTimes(1);
		expect(typeof accountInfo?.address).toBe("string");
		expect(typeof accountInfo?.status).toBe("string");
	});
});

export {};
