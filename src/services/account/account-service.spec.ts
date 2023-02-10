import { AmountType } from "@/common/types/data-prop-types";
import { AccountRepositoryInstance } from "@/repositories/account/account-repository-instance";
import { AccountService } from "./account-service";
import { AccountRepositoryMock } from "@/repositories/account";
import { AccountError } from "@/common/errors/account";
import BigNumber from "bignumber.js";
import { AdenaClient } from "@/common/clients/wallet-client/adena-client";
import { WalletClient } from "@/common/clients/wallet-client";
import { AxiosClient } from "@/common/clients/network-client/axios-client";
import {
	StorageClient,
	WebStorageClient,
} from "@/common/clients/storage-client";

const walletClient: WalletClient = AdenaClient.createAdenaClient();
const localStorageClient: StorageClient =
	WebStorageClient.createLocalStorageClient();
const accountRepository = new AccountRepositoryInstance(
	walletClient,
	localStorageClient,
);
const accountService = new AccountService(accountRepository);

beforeEach(() => {
	jest.clearAllMocks();
});

describe("getAccountInfo", () => {
	const spyFnGetAccountInfo = jest.spyOn(accountRepository, "getAccount");

	it("Successful connection to account", async () => {
		const accountInfo = await accountService.getAccountInfo();

		expect(spyFnGetAccountInfo).toBeCalledTimes(1);
		expect(typeof accountInfo?.address).toBe("string");
		expect(accountInfo?.address).not.toBeNull();
		expect(accountInfo?.amount).not.toBeNull();
		expect(typeof accountInfo?.status).toBe("string");
	});
});

export {};
