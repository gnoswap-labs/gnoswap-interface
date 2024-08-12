import { NetworkClient } from "@common/clients/network-client";
import { StorageClient } from "@common/clients/storage-client";
import { WalletClient } from "@common/clients/wallet-client";
import { SendTransactionRequestParam } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { AdenaError } from "@common/errors/adena";
import { SessionStorageKeyType, StorageKeyType } from "@common/values";
import { StatusOptions } from "@common/values/data-constant";
import { GnoProvider } from "@gnolang/gno-js-client";
import { AccountBalanceModel } from "@models/account/account-balance-model";
import {
  AccountHistoryModel,
  TransactionModel
} from "@models/account/account-history-model";
import { AccountMapper } from "@models/account/mapper/account-mapper";
import { GNOWSWAP_CONNECTED_KEY } from "@states/common";

import { AccountBalancesResponse, AccountRepository } from ".";
import { AvgBlockTime } from "./response/get-avg-block-time-response";

export class AccountRepositoryImpl implements AccountRepository {
  private walletClient: WalletClient | null;
  private networkClient: NetworkClient | null;
  private rpcProvider: GnoProvider | null;
  private localStorageClient: StorageClient<StorageKeyType>;
  private sessionStorageClient: StorageClient<SessionStorageKeyType>;

  constructor(
    walletClient: WalletClient | null,
    networkClient: NetworkClient | null,
    localStorageClient: StorageClient,
    sessionStorageClient: StorageClient,
    rpcProvider: GnoProvider | null,
  ) {
    this.walletClient = walletClient;
    this.networkClient = networkClient;
    this.localStorageClient = localStorageClient;
    this.sessionStorageClient = sessionStorageClient;
    this.rpcProvider = rpcProvider;
  }

  public isConnectedWalletBySession = () => {
    const response = this.sessionStorageClient.get(GNOWSWAP_CONNECTED_KEY);
    return response === "connected";
  };

  public setConnectedWallet = (connected: boolean) => {
    if (connected) {
      this.sessionStorageClient.set(GNOWSWAP_CONNECTED_KEY, "connected");
      return;
    }
    this.sessionStorageClient.remove(GNOWSWAP_CONNECTED_KEY);
  };

  public getAccount = async () => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const response = await this.walletClient.getAccount();
    AdenaError.valdiate(response);
    return AccountMapper.fromResponse(response);
  };

  public getBalances = async (
    address: string,
  ): Promise<AccountBalanceModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const response = await this.networkClient.get<AccountBalancesResponse>({
      url: `/user/${address}/balance`,
    });
    return response.data.balances;
  };

  public getUsername = async (address: string): Promise<string> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }
    console.log(address);
    // TODO: These lines are applied after the contract function that retrieves the member name is developed.
    // const param = makeABCIParams("GetUserByAddress", [address]);
    // const result = await this.rpcProvider
    //   .evaluateExpression("gno.land/r/demo/users", param)
    //   .then(evaluateExpressionToValues);
    // return result.length > 0 ? result[0] : "";
    return "";
  };

  public existsWallet = () => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const response = this.walletClient.existsWallet();
    return response;
  };

  public addEstablishedSite = async () => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const SITE_NAME = "Gnoswap";
    const response = await this.walletClient.addEstablishedSite(SITE_NAME);
    return response;
  };

  public sendTransaction = async (request: SendTransactionRequestParam) => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
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
      throw new Error(`Not found history : ${e}`);
    }
    return history;
  };

  public getBalanceByKey = async (address: string, tokenKey: string) => {
    if (!this.rpcProvider) {
      return null;
    }
    const res = await this.rpcProvider?.getBalance(address, tokenKey);
    return res;
  };

  public switchNetwork = async (chainId: string) => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const response = await this.walletClient.switchNetwork(chainId);
    return response;
  };

  public async getAvgBlockTime(request: {
    startBlock?: number;
  }): Promise<AvgBlockTime> {
    if (this.networkClient === null) {
      throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
    }

    const res = await this.networkClient.get<{ data: AvgBlockTime }>({
      url: `/util/avgBlockTime${
        request.startBlock ? `?compareHeight=${request.startBlock}` : ""
      }`,
    });

    return res.data.data;
  }
}
