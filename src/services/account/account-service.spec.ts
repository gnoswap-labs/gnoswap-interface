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
import {
	addressValidationCheck,
	isErrorResponse,
} from "@/common/utils/validation-util";
import { WalletAdenaModel } from "@/models/account/wallet-adena-model";
import {
	AccountHistoryModel,
	TransactionModel,
} from "@/models/account/account-history-model";
import { ErrorResponse } from "@/common/errors/response";

let localStorageClient: StorageClient;
let accountRepository: AccountRepository;
let accountService: AccountService;

beforeEach(() => {
	localStorageClient = new MockStorageClient("LOCAL");
	accountRepository = new AccountRepositoryMock(localStorageClient);
	accountService = new AccountService(accountRepository);
	jest.clearAllMocks();
});

describe("Get account info", () => {
	it("Successful connection to account", async () => {
		// given
		const spyFnGetAccountInfo = jest.spyOn(accountRepository, "getAccount");
		// when
		const response = await accountService.getAccountInfo();
		const accountInfo = response as AccountInfoModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnGetAccountInfo).toBeCalledTimes(1);
		expect(response).not.toBeInstanceOf(AccountError);
		expect(typeof accountInfo?.status).toBe("string");
		expect(typeof accountInfo.address).toBe("string");
		expect(addressValidationCheck(accountInfo.address)).toBeTruthy();
		expect(accountInfo.amount).toBeTruthy();
		expect(accountInfo.amount.value).toBeInstanceOf(BigNumber);
		expect(typeof accountInfo.amount.denom).toBe("string");
	});

	it("Failed connection to account", async () => {
		// given
		// occur error in repository
		accountRepository.getAccount = jest
			.fn()
			.mockRejectedValue(new AccountError("CONNECT_TRY_AGAIN"));

		// when
		const response = await accountService.getAccountInfo();

		// then
		expect(accountRepository.getAccount).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Connect adena wallet", () => {
	it("There is no Adena wallet that exist.", async () => {
		// given
		const connected = false;
		accountRepository.existsWallet = jest.fn().mockReturnValue(connected);

		// when
		const response = await accountService.connectAdenaWallet();
		const walletAdena = response as ErrorResponse;

		// then
		expect(accountRepository.existsWallet).toBeCalledTimes(1);
		expect(walletAdena.isError).toBeTruthy();
	});

	it("There's an Adena wallet that exists.", async () => {
		// given
		const connected = true;

		// occur error in repository
		accountRepository.existsWallet = jest.fn().mockReturnValue(connected);

		// when
		const response = await accountService.connectAdenaWallet();
		const walletAdena = response as WalletAdenaModel;

		// then
		expect(accountRepository.existsWallet).toBeCalledTimes(1);
		expect(walletAdena).toBeTruthy();
		expect(typeof walletAdena.isConnected).toBe("boolean");
		expect(typeof walletAdena.code).toBe("number");
		expect(walletAdena.code).not.toBeNull();
		expect([0, 4001]).toContain(walletAdena.code);
		expect(walletAdena.isConnected).toBe(true);
	});

	it("An unknown error occurred in the connection of the Adena wallet.", async () => {
		// given
		const connected = false;
		// occur error in repository
		accountRepository.existsWallet = jest.fn().mockReturnValue(connected);

		// when
		const response = await accountService.connectAdenaWallet();
		const walletAdena = response as ErrorResponse;

		// then
		expect(accountRepository.existsWallet).toBeCalledTimes(1);
		expect(walletAdena.isError).toBeTruthy();
	});

	it("User rejected to log in from wallet.", async () => {
		// given
		// occur error in repository
		accountRepository.addEstablishedSite = jest
			.fn()
			.mockRejectedValue(new AccountError("CONNECTION_REJECTED"));

		// when
		const response = await accountService.connectAdenaWallet();

		// then
		expect(accountRepository.addEstablishedSite).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get Notifications By Address", () => {
	it("Import of Notifications to address successfully.", async () => {
		// given
		const spyFnNotificationsByAddress = jest.spyOn(
			accountRepository,
			"getNotificationsByAddress",
		);
		const address = "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt";

		// when
		const response = await accountService.getNotifications(address);
		const getNoti = response as AccountHistoryModel;

		//then
		expect(spyFnNotificationsByAddress).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(true);
		expect(Array.isArray(getNoti.txs)).toBe(true);
	});

	it("Success create notification", async () => {
		// given
		const spyFnCreateNotification = jest.spyOn(
			accountRepository,
			"createNotification",
		);
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
		const response = await accountService.createNotification(
			address,
			transaction,
		);

		// then
		expect(spyFnCreateNotification).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(true);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(true);
	});

	it("Failed create Notification", async () => {
		// given
		const address = "g54276fdsaga";
		const tokenDefault = {
			tokenId: "",
			name: "",
			symbol: "",
		};
		const transaction: TransactionModel = {
			txType: 0,
			txHash: "",
			tokenInfo: tokenDefault,
			status: "FAILED",
			createdAt: "",
		};

		// occur error in repository
		accountRepository.createNotification = jest
			.fn()
			.mockRejectedValue(new AccountError("FAILED_NOTI_CREATE"));

		//when
		const response = await accountService.createNotification(
			address,
			transaction,
		);

		// then
		expect(accountRepository.createNotification).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
		expect(addressValidationCheck(address)).toBe(false);
	});

	it("Success update notification Status", async () => {
		// given
		const spyFnUpdateNotificationStatus = jest.spyOn(
			accountRepository,
			"updateNotificationStatus",
		);
		const address = "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt";
		const txHash = "1";
		const status = "SUCCESS";

		// when
		const response = await accountService.updateNotificationStatus(
			address,
			txHash,
			status,
		);

		// then
		expect(spyFnUpdateNotificationStatus).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(true);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(true);
	});

	it("Failed update notification Status", async () => {
		// given
		const address = "g14qv";
		const txHash = "";
		const status = "FAILED";

		// occur error in repository
		accountRepository.updateNotificationStatus = jest
			.fn()
			.mockRejectedValue(new AccountError("FAILED_NOTI_STATUS_UPDATE"));

		// when
		const response = await accountService.updateNotificationStatus(
			address,
			txHash,
			status,
		);

		// then
		expect(accountRepository.updateNotificationStatus).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
		expect(addressValidationCheck(address)).toBe(false);
	});

	it("Success delete All notificatioun", async () => {
		// given
		const spyFnDeleteAllNotifications = jest.spyOn(
			accountRepository,
			"deleteAllNotifications",
		);
		const address = "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt";

		// when
		const response = await accountService.deleteAllNotification(address);

		// then
		expect(spyFnDeleteAllNotifications).toBeCalledTimes(1);
		expect(addressValidationCheck(address)).toBe(true);
		expect(typeof response).toBe("boolean");
		expect(response).toBe(true);
	});

	it("Failed delete All notificatioun", async () => {
		// given
		const address = "g14qv";

		// occur error in repository
		accountRepository.deleteAllNotifications = jest
			.fn()
			.mockRejectedValue(new AccountError("FAILED_DILETE_ALL_NOTI"));

		// when
		const response = await accountService.deleteAllNotification(address);

		// then
		expect(accountRepository.deleteAllNotifications).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
		expect(addressValidationCheck(address)).toBe(false);
	});
});

export {};
