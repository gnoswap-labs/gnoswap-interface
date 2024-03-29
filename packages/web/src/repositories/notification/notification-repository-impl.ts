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

export class NotificationRepositoryImpl implements NotificationRepository {
  private networkClient: NetworkClient;
  private storage: StorageClient<StorageKeyType>;

  constructor(
    networkClient: NetworkClient,
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
    if (symbol === "WGNOT") return "GNOT";
    return symbol;
  };

  private replaceUri = (symbol: string, uri: string) => {
    if (symbol === "WGNOT")
      return "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg";
    return uri;
  };

  private getNotificationMessage = (tx: AccountActivity) => {
    const token0Amount = prettyNumberFloatInteger(tx?.token0Amount);
    const token0symbol = this.replaceToken(tx?.token0?.symbol);

    const token1Amount = prettyNumberFloatInteger(tx?.token1Amount);
    const token1symbol = this.replaceToken(tx?.token1?.symbol);

    switch (tx.actionType) {
      case "SWAP":
        return `Swapped <span>${token0Amount}</span> <span>${token0symbol}</span> for <span>${token1Amount}</span> <span>${token1symbol}</span>`;
      case "ADD":
        return `Added <span>${token0Amount}</span> <span>${token0symbol}</span> and <span>${token1Amount}</span> <span>${token1symbol}</span>`;
      case "REMOVE":
        return `Removed <span>${token0Amount}</span> <span>${token0symbol}</span> and <span>${token1Amount}</span> <span>${token1symbol}</span>`;
      case "STAKE":
        return `Staked <span>${token0Amount}</span> <span>${token0symbol}</span> and <span>${token1Amount}</span> <span>${token1symbol}</span>`;
      case "UNSTAKE":
        return `Unstaked <span>${token0Amount}</span> <span>${token0symbol}</span> and <span>${token1Amount}</span> <span>${token1symbol}</span>`;
      case "CLAIM":
        return `Claimed <span>${token0Amount}</span> <span>${token0symbol}</span>`;
      case "WITHDRAW":
        return `Sent <span>${token0Amount}</span> <span>${token0symbol}</span>`;
      case "DEPOSIT":
        return `Received <span>${token0Amount}</span> <span>${token0symbol}</span>`;
      default:
        return `${this.capitalizeFirstLetter(tx.actionType)} ${prettyNumberFloatInteger(
          tx.token0Amount,
        )} ${this.replaceToken(tx.token0.symbol ?? tx.token1.symbol)}`;
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

    for (const tx of transactions) {
      /**
       * *If tx is removed then ignore it
       **/
      if (removedTxs.includes(tx.txHash)) continue;

      const tokenA = {
        ...tx.token0,
        symbol: this.replaceToken(tx.token0?.symbol),
        logoURI: this.replaceUri(tx.token0?.symbol, tx.token0?.logoURI),
      };
      const tokenB = {
        ...tx.token1,
        symbol: this.replaceToken(tx.token1?.symbol),
        logoURI: this.replaceUri(tx.token1?.symbol, tx.token1?.logoURI),
      };

      const transactionDate = dayjs(tx.time);
      const txModel: TransactionModel = {
        txType: tx.token1.name ? 1 : 0,
        txHash: tx.txHash,
        tokenInfo: { tokenA, tokenB },
        status: "SUCCESS",
        createdAt: tx.time,
        content: this.getNotificationMessage(tx),
        isRead: seenTxs.includes(tx.txHash), // * Check if transaction is already seen
      };

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
    if (!request?.address) {
      return [];
    }
    try {
      const { data } = await this.networkClient.get<AccountActivity[]>({
        url: "/onchain_all" + "/" + request.address,
      });

      return data;
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
}
