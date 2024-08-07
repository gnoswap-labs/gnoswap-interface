import { NetworkClient } from "@common/clients/network-client";
import { StorageClient } from "@common/clients/storage-client";
import { CommonError } from "@common/errors";
import { StorageKeyType } from "@common/values";
import { TransactionModel } from "@models/account/account-history-model";
import { TransactionGroupsType } from "@models/notification";
import { NotificationMapper } from "@models/notification/mapper/notification-mapper";

import { NotificationRepository } from "./dashboard-repository";
import { AccountActivityRequest } from "./request";
import { DeleteAccountActivityRequest } from "./request/delete-account-activity-request";
import { AccountActivity } from "./response";

export class NotificationRepositoryImpl implements NotificationRepository {
  private networkClient: NetworkClient | null;
  private storage: StorageClient<StorageKeyType>;

  constructor(
    networkClient: NetworkClient | null,
    localStorageClient: StorageClient<StorageKeyType>,
  ) {
    this.networkClient = networkClient;
    this.storage = localStorageClient;
  }

  private getRemovedTx = (): string[] => {
    return JSON.parse(
      this.storage.get("notification-removed-tx") ?? "[]",
    ) as string[];
  };

  private getSeenTx = (): string[] => {
    return JSON.parse(
      this.storage.get("notification-seen-tx") ?? "[]",
    ) as string[];
  };

  public setRemovedTx = (txs: string[]): void => {
    this.storage.set("notification-removed-tx", JSON.stringify(txs));
  };

  public setSeenTx = (txs: string[]): void => {
    this.storage.set("notification-seen-tx", JSON.stringify(txs));
  };

  public appendRemovedTx = (txs: string[]) => {
    const oldTx = this.getRemovedTx();
    oldTx.push(...txs);

    /**
     * Use set to make it don't have duplicate tx ( reduce storage size )
     */
    this.storage.set(
      "notification-removed-tx",
      JSON.stringify([...new Set(oldTx)]),
    );
  };

  public appendSeenTx = (txs: string[]) => {
    const oldTx = this.getSeenTx();
    oldTx.push(...txs);
    /**
     * Use set to make it don't have duplicate tx ( reduce storage size )
     */
    this.storage.set(
      "notification-seen-tx",
      JSON.stringify([...new Set(oldTx)]),
    );
  };

  private replaceToken = (symbol: string) => {
    if (symbol === "wugnot") return "GNOT";
    return symbol;
  };

  private replaceUri = (symbol: string, uri: string) => {
    if (symbol === "wugnot")
      return "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg";
    return uri;
  };

  public getAccountOnchainActivity = async (
    request: AccountActivityRequest,
  ): Promise<AccountActivity[]> => {
    if (!this.networkClient) {
      return [];
    }
    if (!request?.address) {
      return [];
    }
    try {
      const { data } = await this.networkClient.get<{
        data: AccountActivity[];
        error: unknown;
      }>({
        url: "/users/" + request.address + "/activity",
      });

      return data.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };

  public getGroupedNotification = async (
    request: AccountActivityRequest,
  ): Promise<TransactionGroupsType[]> => {
    const data = await this.getAccountOnchainActivity(request);
    const removedTxs = this.getRemovedTx();
    const seenTxs = this.getSeenTx();

    const transactionResult = [];

    for (const tx of data ?? []) {
      /**
       * *If tx is removed then ignore it
       **/
      if (removedTxs.includes(tx.txHash)) continue;

      /**
       * *If tx both amounts are `0` ignore it
       **/
      if (!Number(tx.tokenAAmount) && !Number(tx.tokenBAmount)) {
        continue;
      }

      const tokenA = {
        ...tx.tokenA,
        symbol: this.replaceToken(tx.tokenA?.symbol),
        logoURI: this.replaceUri(tx.tokenA?.symbol, tx.tokenA?.logoURI),
      };
      const tokenB = {
        ...tx.tokenB,
        symbol: this.replaceToken(tx.tokenB?.symbol),
        logoURI: this.replaceUri(tx.tokenB?.symbol, tx.tokenB?.logoURI),
      };

      const txModel: TransactionModel = {
        txType: tx.tokenB.name ? 1 : 0,
        txHash: tx.txHash,
        tokenInfo: { tokenA, tokenB },
        status: "SUCCESS",
        createdAt: tx.time,
        isRead: seenTxs.includes(tx.txHash), // * Check if transaction is already seen
        rawValue: tx,
      };

      if (tokenA) transactionResult.push(txModel);
    }

    return NotificationMapper.notificationGroupFromTransaction(
      transactionResult,
    );
  };

  public clearNotification = async (
    request: DeleteAccountActivityRequest,
  ): Promise<void> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    await this.networkClient.delete({
      url: "/users/" + request.address + "/activity",
    });
  };
}
