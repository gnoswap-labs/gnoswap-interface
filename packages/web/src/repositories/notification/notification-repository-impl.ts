import { StorageKeyType } from "@common/values";
import { StorageClient } from "@common/clients/storage-client";
import { NetworkClient } from "@common/clients/network-client";
import { NotificationRepository } from "./dashboard-repository";
import { AccountActivityRequest } from "./request";
import { AccountActivity } from "./response";
import { TransactionGroupsType } from "@components/common/notification-button/NotificationButton";
import { TransactionModel } from "@models/account/account-history-model";
import dayjs from "dayjs";
import { prettyNumberFloatInteger } from "@utils/number-utils";
import { DeleteAccountActivityRequest } from "./request/delete-account-activity-request";
import { CommonError } from "@common/errors";

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

  private capitalizeFirstLetter = (input: string) => {
    const str = input.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
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

  private getNotificationMessage = (tx: AccountActivity) => {
    const token0Amount = prettyNumberFloatInteger(tx?.tokenAAmount);
    const token0symbol = this.replaceToken(tx?.tokenA?.symbol);

    const token1Amount = prettyNumberFloatInteger(tx?.tokenBAmount);
    const token1symbol = this.replaceToken(tx?.tokenB?.symbol);

    const token0Display = Number(tx?.tokenAAmount)
      ? `<span>${token0Amount}</span> <span>${token0symbol}</span>`
      : "";
    const token1Display = Number(tx?.tokenBAmount)
      ? `<span>${token1Amount}</span> <span>${token1symbol}</span>`
      : "";
    const tokenStr = [token0Display, token1Display]
      .filter(item => item)
      .join(" and ");

    switch (tx.actionType) {
      case "SWAP":
        return `Swapped ${tokenStr}`;
      case "ADD":
        return `Added ${tokenStr}`;
      case "REMOVE":
        return `Removed ${tokenStr}`;
      case "STAKE":
        return `Staked ${tokenStr}`;
      case "UNSTAKE":
        return `Unstaked ${tokenStr}`;
      case "CLAIM":
        return `Claimed ${tokenStr}`;
      case "WITHDRAW":
        return `Sent ${token0Display}`;
      case "DEPOSIT":
        return `Received ${token0Display}`;
      case "DECREASE":
        return `Decreased ${token0Display}`;
      case "INCREASE":
        return `Increased ${token0Display}`;
      case "REPOSITION":
        return `Repositioned ${token0Display}`;
      default:
        return `${this.capitalizeFirstLetter(
          tx.actionType,
        )} ${prettyNumberFloatInteger(tx.tokenAAmount)} ${this.replaceToken(
          tx.tokenA.symbol ?? tx.tokenB.symbol,
        )}`;
    }
  };

  // Function to group the transactions by date
  groupTransactionsByDate = (
    transactions: AccountActivity[],
  ): TransactionGroupsType[] => {
    const today = dayjs();
    const todayTransactions: TransactionModel[] = [];
    const pastWeekTransactions: TransactionModel[] = [];
    const pastMonthTransactions: TransactionModel[] = [];
    const olderTransactions: TransactionModel[] = [];

    const removedTxs = this.getRemovedTx();
    const seenTxs = this.getSeenTx();

    for (const tx of transactions ?? []) {
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

      const transactionDate = dayjs(tx.time);
      const txModel: TransactionModel = {
        txType: tx.tokenB.name ? 1 : 0,
        txHash: tx.txHash,
        tokenInfo: { tokenA, tokenB },
        status: "SUCCESS",
        createdAt: tx.time,
        content: this.getNotificationMessage(tx),
        isRead: seenTxs.includes(tx.txHash), // * Check if transaction is already seen
        rawValue: tx,
      };

      if (tokenA)
        if (transactionDate.isSame(today, "day")) {
          todayTransactions.push(txModel);
        } else if (transactionDate.isAfter(today.subtract(7, "day"))) {
          pastWeekTransactions.push(txModel);
        } else if (transactionDate.isAfter(today.subtract(30, "day"))) {
          pastMonthTransactions.push(txModel);
        } else {
          olderTransactions.push(txModel);
        }
    }

    const res = [];

    if (todayTransactions.length !== 0) {
      res.push({
        title: "Today",
        txs: todayTransactions,
      });
    }

    if (pastWeekTransactions.length !== 0) {
      res.push({
        title: "Past 7 Days",
        txs: pastWeekTransactions,
      });
    }

    if (pastMonthTransactions.length !== 0) {
      res.push({
        title: "Past 30 Days",
        txs: pastMonthTransactions,
      });
    }

    if (olderTransactions.length !== 0) {
      res.push({
        title: "More than a month ago",
        txs: olderTransactions,
      });
    }

    return res;
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
        error: any;
      }>({
        url: "/users/" + request.address + "/activity",
      });

      return data.data;
    } catch (error) {
      return [];
    }
  };

  public getGroupedNotification = async (
    request: AccountActivityRequest,
  ): Promise<TransactionGroupsType[]> => {
    const data = await this.getAccountOnchainActivity(request);
    return this.groupTransactionsByDate(data);
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
