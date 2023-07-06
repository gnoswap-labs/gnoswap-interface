import { StorageClient } from "@common/clients/storage-client";
import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena-client";
import {
  generateToken0,
  generateToken1,
  generateTokenModel,
} from "@common/utils/test-util";
import { NotificationType } from "@common/values/data-constant";
import {
  AccountHistoryModel,
  TransactionModel,
} from "@models/account/account-history-model";
import { AccountNotificationRepository } from "./account-notification-repository";
import { AccountRepositoryInstance } from "./account-repository-instance";

let walletClient: WalletClient;
let localStorageClient: StorageClient;
let accountNotificationRepository: AccountNotificationRepository;

beforeEach(() => {
  walletClient = new AdenaClient();
  localStorageClient = new MockStorageClient("LOCAL");
  accountNotificationRepository = new AccountRepositoryInstance(
    walletClient,
    localStorageClient,
  );
  jest.clearAllMocks();
});

describe("get notifications by address", () => {
  it("success", async () => {
    const address = "ADDRESS";
    const data = {
      [address]: {
        txs: [
          {
            txType: NotificationType.AddIncentive,
            txHash: "1",
            tokenInfo: { ...generateTokenModel() },
            status: "SUCCESS",
            createdAt: "1900-01-01",
          },
        ],
      },
    };
    localStorageClient.get = jest.fn().mockReturnValue(JSON.stringify(data));

    const notification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );

    expect(notification).toBeTruthy();
    expect(notification.txs).toHaveLength(1);
  });

  it("invalid storage data is error", async () => {
    const address = "ADDRESS";
    const stringValue = "INVALID TYPE";
    let error = null;
    localStorageClient.get = jest.fn().mockReturnValue(stringValue);

    try {
      expect(
        await accountNotificationRepository.getNotificationsByAddress(address),
      ).toThrowError();
    } catch (e) {
      error = e;
    }

    expect(error).toBeTruthy();
  });

  it("empty storage value is default", async () => {
    const address = "ADDRESS";
    const stringValue = "";
    localStorageClient.get = jest.fn().mockReturnValue(stringValue);

    const response = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );

    expect(response).toBeTruthy();
    expect(response.txs).toHaveLength(0);
  });

  it("null storage value is default", async () => {
    const address = "ADDRESS";
    localStorageClient.get = jest.fn().mockReturnValue(null);

    const response = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );

    expect(response).toBeTruthy();
    expect(response.txs).toHaveLength(0);
  });
});

describe("create notifications", () => {
  it("success", async () => {
    const address = "ADDRESS";
    const data: TransactionModel = {
      txType: NotificationType.AddIncentive,
      txHash: "1",
      tokenInfo: { ...generateTokenModel() },
      status: "SUCCESS",
      createdAt: "1900-01-01",
    };

    const beforeNotification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );
    const resposne = await accountNotificationRepository.createNotification(
      address,
      data,
    );
    const afterNotification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );

    expect(resposne).toBe(true);
    expect(beforeNotification.txs.length).toBe(0);
    expect(afterNotification.txs.length).toBe(1);
  });
});

describe("create notifications", () => {
  it("success", async () => {
    const address = "ADDRESS";
    const data: TransactionModel = {
      txType: NotificationType.AddIncentive,
      txHash: "1",
      tokenInfo: { ...generateTokenModel() },
      status: "PENDING",
      createdAt: "1900-01-01",
    };

    await accountNotificationRepository.createNotification(address, data);
    const beforeNotification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );
    await accountNotificationRepository.updateNotificationStatus(
      address,
      data.txHash,
      "SUCCESS",
    );
    const afterNotification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );

    expect(beforeNotification.txs.length).toBe(1);
    expect(afterNotification.txs.length).toBe(1);
    expect(beforeNotification.txs[0].status).toBe("PENDING");
    expect(afterNotification.txs[0].status).toBe("SUCCESS");
  });

  it("not matched transaction is not changed", async () => {
    const address = "ADDRESS";
    const data: TransactionModel = {
      txType: NotificationType.AddIncentive,
      txHash: "1",
      tokenInfo: { ...generateTokenModel() },
      status: "PENDING",
      createdAt: "1900-01-01",
    };

    await accountNotificationRepository.createNotification(address, data);
    const beforeNotification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );
    await accountNotificationRepository.updateNotificationStatus(
      address,
      "XXX",
      "SUCCESS",
    );
    const afterNotification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );

    expect(beforeNotification.txs.length).toBe(1);
    expect(afterNotification.txs.length).toBe(1);
    expect(beforeNotification.txs[0].status).toBe("PENDING");
    expect(afterNotification.txs[0].status).toBe("PENDING");
  });
});

describe("delete all notifications", () => {
  it("success", async () => {
    const address = "ADDRESS";
    const data: TransactionModel = {
      txType: NotificationType.AddIncentive,
      txHash: "1",
      tokenInfo: { ...generateTokenModel() },
      status: "PENDING",
      createdAt: "1900-01-01",
    };

    await accountNotificationRepository.createNotification(address, data);
    const beforeNotification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );
    await accountNotificationRepository.deleteAllNotifications(address);
    const afterNotification = await accountNotificationRepository.getNotificationsByAddress(
      address,
    );

    expect(beforeNotification.txs.length).toBe(1);
    expect(afterNotification.txs.length).toBe(0);
  });
});
