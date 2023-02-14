import { BigNumber } from "bignumber.js";
import { AccountInfoModel } from "@/models/account/account-info-model";
import { AccountError } from "@/common/errors/account";
import { AccountService } from "./account-service";
import {
	AccountRepository,
	AccountRepositoryMock,
} from "@/repositories/account";
import { StorageClient } from "@/common/clients/storage-client";
import { MockStorageClient } from "@/common/clients/storage-client/mock-storage-client";
import { addressValidationCheck } from "@/common/utils/validation-util";
import { WalletAdenaModel } from "@/models/account/wallet-adena-model";
import { TransactionModel } from "@/models/account/account-history-model";

let localStorageClient: StorageClient;
let accountRepository: AccountRepository;
let accountService: AccountService;

beforeEach(() => {
	localStorageClient = new MockStorageClient("LOCAL");
	accountRepository = new AccountRepositoryMock(localStorageClient);
	accountService = new AccountService(accountRepository);
	jest.clearAllMocks();
});

describe("Get account info", async () => {
	const spyFnGetAccountInfo = jest.spyOn(accountRepository, "getAccount");

	it("Successful connection to account", async () => {
		// given
		// when
		const response = await accountService.getAccountInfo();
		const accountInfo = response as AccountInfoModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnGetAccountInfo).toBeCalledTimes(1);
		expect(response).not.toBeInstanceOf(AccountError);
		expect(typeof accountInfo?.status).toBe("string");
		expect(typeof accountInfo.address).toBe("string");
		expect(accountInfo.address).toBe(
			addressValidationCheck(accountInfo.address),
		);
		expect(accountInfo.amount).toBeTruthy();
		expect(accountInfo.amount.value).toBeInstanceOf(BigNumber);
		expect(accountInfo.amount.denom).toBe("string");
	});
	it("Check if the values of the coins and address are correct", async () => {
		// given
		const defaultAccountInfo = {
			status: "",
			address: "",
			coins: null,
			publicKey: {
				"@type": "----",
				value: "----",
			},
			accountNumber: "1",
			sequence: "1",
			chainId: "test3",
		};
		const injectRes = {
			code: 0,
			status: "success",
			type: "GET_ACCOUNT",
			message: "Get account.",
			data: defaultAccountInfo,
		};

		// occur error in repository
		accountRepository.getAccount = jest.fn().mockResolvedValue(injectRes);

		//when
		const response = await accountService.getAccountInfo();
		const accountInfo = response as AccountInfoModel;

		// then
		expect(spyFnGetAccountInfo).toBeCalledTimes(1);
		expect(accountInfo.amount.value).toBe(BigNumber(0));
		expect(accountInfo.amount.denom).toBe("");
		expect(accountInfo.address).toBe("");
	});
});

describe("Connect adena wallet", async () => {
	const spyFnExistsWallet = jest.spyOn(accountRepository, "existsWallet");

	it("There is no Adena wallet that exist.", async () => {
		// given
		const connected = false;

		// occur error in repository
		accountRepository.existsWallet = jest.fn().mockResolvedValue(connected);

		// when
		const response = await accountService.connectAdenaWallet();
		const walletAdena = response as WalletAdenaModel;

		// then
		expect(spyFnExistsWallet).toBeCalledTimes(1);
		expect(typeof walletAdena.isConnected).toBe("boolean");
		expect(typeof walletAdena.code).toBe("number");
		expect(walletAdena.code).toBe(![0, 4001, 9000].includes(walletAdena.code));
		expect(walletAdena.isConnected).toBe(false);
	});

	it("There's an Adena wallet that exists.", async () => {
		// given
		const connected = true;

		// occur error in repository
		accountRepository.existsWallet = jest.fn().mockResolvedValue(connected);

		// when
		const response = await accountService.connectAdenaWallet();
		const walletAdena = response as WalletAdenaModel;

		// then
		expect(spyFnExistsWallet).toBeCalledTimes(1);
		expect(walletAdena).toBeTruthy();
		expect(typeof walletAdena.isConnected).toBe("boolean");
		expect(typeof walletAdena.code).toBe("number");
		expect(walletAdena.code).toBe([0, 4001].includes(walletAdena.code));
		expect(walletAdena.isConnected).toBe(true);
	});

	it("An unknown error occurred in the connection of the Adena wallet.", async () => {
		// given
		const connected = false;

		// occur error in repository
		accountRepository.existsWallet = jest.fn().mockResolvedValue(connected);

		// when
		const response = await accountService.connectAdenaWallet();
		const walletAdena = response as WalletAdenaModel;

		// then
		expect(spyFnExistsWallet).toBeCalledTimes(1);
		expect(typeof walletAdena.isConnected).toBe("boolean");
		expect(typeof walletAdena.code).toBe("number");
		expect(walletAdena.code).toBe([9000].includes(walletAdena.code));
		expect(walletAdena.isConnected).toBe(false);
	});
});

describe("Get Notifications By Address", () => {
	const spyFnNotificationsByAddress = jest.spyOn(
		accountRepository,
		"getNotificationsByAddress",
	);

	it("Import of Notifications to address successfully.", async () => {
		// given
		const address = "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt";

		// when
		const response = await accountRepository.getNotificationsByAddress(address);

		//then
		expect(spyFnNotificationsByAddress).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(true);
		expect(Array.isArray(response.txs)).toBe(true);
	});

	it("Success create notification", async () => {
		// given
		const address = "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt";
		const tokenDefault = {
			tokenId: "1",
			name: "test",
			symbol: "TEST",
		};
		const transaction: TransactionModel = {
			txType: 0,
			txHash: "1",
			tokenInfo: tokenDefault,
			status: "SUCCESS",
			createdAt: "2022/2/2",
		};

		// when
		const response = await accountRepository.createNotification(
			address,
			transaction,
		);

		// then
		expect(spyFnNotificationsByAddress).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(true);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(true);
	});

	it("Failed create Notification", async () => {
		// given
		const address = "";
		const tokenDefault = {
			tokenId: "",
			name: "",
			symbol: "",
		};
		const transaction: TransactionModel = {
			txType: 0,
			txHash: "",
			tokenInfo: tokenDefault,
			status: "SUCCESS",
			createdAt: "",
		};

		// when
		const response = await accountRepository.createNotification(
			address,
			transaction,
		);

		// then
		expect(spyFnNotificationsByAddress).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(false);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(false);
	});

	it("Success update notification Status", async () => {
		// given
		const address = "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt";
		const txHash = "1";
		const status = "SUCCESS";

		// when
		const response = await accountRepository.updateNotificationStatus(
			address,
			txHash,
			status,
		);

		// then
		expect(spyFnNotificationsByAddress).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(true);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(true);
	});

	it("Failed update notification Status", async () => {
		// given
		const address = "g14qv";
		const txHash = "";
		const status = "SUCCESS";

		// when
		const response = await accountRepository.updateNotificationStatus(
			address,
			txHash,
			status,
		);

		// then
		expect(spyFnNotificationsByAddress).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(false);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(false);
	});

	it("Success delete All notificatioun", async () => {
		// given
		const address = "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt";

		// when
		const response = await accountRepository.deleteAllNotifications(address);

		// then
		expect(spyFnNotificationsByAddress).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(true);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(true);
	});

	it("Failed delete All notificatioun", async () => {
		// given
		const address = "g14qv";

		// when
		const response = await accountRepository.deleteAllNotifications(address);

		// then
		expect(spyFnNotificationsByAddress).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(false);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(false);
	});
});

export {};
