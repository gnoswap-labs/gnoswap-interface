import {
  WalletResponse,
  SendTransactionRequestParam,
  SendTransactionResponse,
} from "@common/clients/wallet-client/protocols";
import { AccountNotificationRepository } from "./account-notification-repository";
import { AccountModel } from "@models/account/account-model";
import { AccountBalanceModel } from "@models/account/account-balance-model";

export interface AccountRepository extends AccountNotificationRepository {
  isConnectedWalletBySession: () => boolean;

  setConnectedWallet: (connected: boolean) => void;

  getBalances: (address: string) => Promise<AccountBalanceModel[]>;

  getAccount: () => Promise<AccountModel>;

  existsWallet: () => boolean;

  addEstablishedSite: () => Promise<WalletResponse>;

  sendTransaction: (
    request: SendTransactionRequestParam,
  ) => Promise<WalletResponse<SendTransactionResponse>>;
}
