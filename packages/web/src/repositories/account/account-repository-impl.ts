import { StorageClient } from "@common/clients/storage-client";
import { WalletClient } from "@common/clients/wallet-client";
import { StatusOptions } from "@common/values/data-constant";
import {
  AccountHistoryModel,
  TransactionModel,
} from "@models/account/account-history-model";
import { SessionStorageKeyType, StorageKeyType } from "@common/values";
import { AccountBalancesResponse, AccountRepository } from ".";
import { AdenaError } from "@common/errors/adena";
import { SendTransactionRequestParam } from "@common/clients/wallet-client/protocols";
import { AccountMapper } from "@models/account/mapper/account-mapper";
import { NetworkClient } from "@common/clients/network-client";
import { AccountBalanceModel } from "@models/account/account-balance-model";

export class AccountRepositoryImpl implements AccountRepository {
  private walletClient: WalletClient;
  private networkClient: NetworkClient;
  private localStorageClient: StorageClient<StorageKeyType>;
  private sessionStorageClient: StorageClient<SessionStorageKeyType>;

  constructor(
    walletClient: WalletClient,
    networkClient: NetworkClient,
    localStorageClient: StorageClient,
    sessionStorageClient: StorageClient,
  ) {
    this.walletClient = walletClient;
    this.networkClient = networkClient;
    this.localStorageClient = localStorageClient;
    this.sessionStorageClient = sessionStorageClient;
  }

  public isConnectedWalletBySession = () => {
    const response = this.sessionStorageClient.get("connectedWallet");
    return response === "connected";
  };

  public setConnectedWallet = (connected: boolean) => {
    if (connected) {
      this.sessionStorageClient.set("connectedWallet", "connected");
    }
    this.sessionStorageClient.remove("connectedWallet");
  };

  public getAccount = async () => {
    const response = await this.walletClient.getAccount();
    AdenaError.valdiate(response);
    return AccountMapper.fromResponse(response);
  };

  public getBalances = async (
    address: string,
  ): Promise<AccountBalanceModel[]> => {
    const response = await this.networkClient.get<AccountBalancesResponse>({
      url: `/user/${address}/balance`,
    });
    return response.data.balances;
  };

  public existsWallet = () => {
    const response = this.walletClient.existsWallet();
    return response;
  };

  public addEstablishedSite = async () => {
    const SITE_NAME = "Gnoswap";
    const response = await this.walletClient.addEstablishedSite(SITE_NAME);
    return response;
  };

  public sendTransaction = async (request: SendTransactionRequestParam) => {
    const response = await this.walletClient.sendTransaction(request);
    return response;
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
