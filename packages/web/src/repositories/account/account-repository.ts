import {
  SendTransactionRequestParam,
  SendTransactionResponse,
  SwitchNetworkResponse, WalletResponse
} from "@common/clients/wallet-client/protocols";
import { AccountBalanceModel } from "@models/account/account-balance-model";
import { AccountModel } from "@models/account/account-model";

import { AccountNotificationRepository } from "./account-notification-repository";
import { AvgBlockTime } from "./response/get-avg-block-time-response";

export interface AccountRepository extends AccountNotificationRepository {
  isConnectedWalletBySession: () => boolean;

  setConnectedWallet: (connected: boolean) => void;

  getBalances: (address: string) => Promise<AccountBalanceModel[]>;

  getUsername: (address: string) => Promise<string>;

  getAccount: () => Promise<AccountModel>;

  existsWallet: () => boolean;

  addEstablishedSite: () => Promise<WalletResponse>;

  sendTransaction: (
    request: SendTransactionRequestParam,
  ) => Promise<WalletResponse<SendTransactionResponse>>;

  switchNetwork: (
    chainId: string,
  ) => Promise<WalletResponse<SwitchNetworkResponse>>;

  getBalanceByKey: (
    address: string,
    tokenKey: string,
  ) => Promise<number | null>;

  // FIXME: it may goto new repository
  getAvgBlockTime: (request: { startBlock?: number }) => Promise<AvgBlockTime>;
}
