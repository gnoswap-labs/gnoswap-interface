import { StorageClient } from "@common/clients/storage-client";
import { WalletClient } from "@common/clients/wallet-client";
import { InjectSendTransactionRequestParam } from "@common/clients/wallet-client/protocols/inject-send-transaction-request";
import { StatusOptions } from "@common/values/data-constant";
import {
  AccountHistoryModel,
  TransactionModel,
} from "@models/account/account-history-model";
import { StorageKeyType } from "@common/values";
import { AccountRepository } from ".";
import { AdenaError } from "@common/errors/adena";

export class AccountRepositoryInstance implements AccountRepository {
  private walletClient: WalletClient;
  private localStorageClient: StorageClient<StorageKeyType>;

  constructor(walletClient: WalletClient, localStorageClient: StorageClient) {
    this.walletClient = walletClient;
    this.localStorageClient = localStorageClient;
  }

  public getAccount = async () => {
    const result = await this.walletClient.getAccount();
    AdenaError.valdiate(result);
    return result;
  };

  public existsWallet = () => {
    const result = this.walletClient.existsWallet();
    return result;
  };

  public addEstablishedSite = async () => {
    const SITE_NAME = "Gnoswap";
    const result = await this.walletClient.addEstablishedSite(SITE_NAME);
    return result;
  };

  public sendTransaction = async (
    request: InjectSendTransactionRequestParam,
  ) => {
    const result = await this.walletClient.sendTransaction(request);
    return result;
  };

  public getNotificationsByAddress = async (
    address: string,
  ): Promise<AccountHistoryModel> => {
    const history = this.getHistory();
    if (!history[address]) {
      return {
        txs: [],
      };
    }

    return history[address];
  };

  public createNotification = async (
    address: string,
    transaction: TransactionModel,
  ): Promise<boolean> => {
    const notifications = await this.getNotificationsByAddress(address);
    const transactions = [...notifications.txs, transaction];
    const history = this.getHistory();
    const savedHistory = {
      ...history,
      [address]: {
        txs: transactions,
      },
    };
    this.localStorageClient.set(
      "transaction-history",
      JSON.stringify(savedHistory),
    );
    return true;
  };

  public updateNotificationStatus = async (
    address: string,
    txHash: string,
    status: StatusOptions,
  ): Promise<boolean> => {
    const notifications = await this.getNotificationsByAddress(address);
    const transactions = [...notifications.txs].map(transaction => {
      if (transaction.txHash === txHash) {
        return {
          ...transaction,
          status,
        };
      }
      return transaction;
    });

    const history = this.getHistory();
    const savedHistory = {
      ...history,
      [address]: {
        txs: transactions,
      },
    };

    this.localStorageClient.set(
      "transaction-history",
      JSON.stringify(savedHistory),
    );
    return true;
  };

  public deleteAllNotifications = async (address: string): Promise<boolean> => {
    const history = this.getHistory();
    const savedHistory = {
      ...history,
      [address]: {
        txs: [],
      },
    };
    this.localStorageClient.set(
      "transaction-history",
      JSON.stringify(savedHistory),
    );
    return true;
  };

  private getHistory = () => {
    let historyValue = this.localStorageClient.get("transaction-history");
    if (!historyValue || historyValue === "") {
      historyValue = JSON.stringify({ txs: [] });
      this.localStorageClient.set("transaction-history", historyValue);
    }

    let history: { [key in string]: AccountHistoryModel } = {};
    try {
      history = JSON.parse(historyValue);
    } catch (e) {
      throw new Error("Not found history");
    }
    return history;
  };
}
