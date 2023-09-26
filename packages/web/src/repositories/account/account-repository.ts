import {
  WalletResponse,
  SendTransactionRequestParam,
  SendTransactionResponse,
} from "@common/clients/wallet-client/protocols";
import { AccountNotificationRepository } from "./account-notification-repository";
import { AccountModel } from "@models/account/account-model";

export interface AccountRepository extends AccountNotificationRepository {
  getAccount: () => Promise<AccountModel>;

  existsWallet: () => boolean;

  addEstablishedSite: () => Promise<WalletResponse>;

  sendTransaction: (
    request: SendTransactionRequestParam,
  ) => Promise<WalletResponse<SendTransactionResponse>>;
}
