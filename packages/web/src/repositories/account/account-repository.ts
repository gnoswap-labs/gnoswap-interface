import {
  WalletResponse,
  SendTransactionRequestParam,
  SendTransactionResponse,
} from "@common/clients/wallet-client/protocols";
import { AccountNotificationRepository } from "./account-notification-repository";
import { AccountInfoResponse } from "./response";

export interface AccountRepository extends AccountNotificationRepository {
  getAccount: () => Promise<WalletResponse<AccountInfoResponse>>;

  existsWallet: () => boolean;

  addEstablishedSite: () => Promise<WalletResponse>;

  sendTransaction: (
    request: SendTransactionRequestParam,
  ) => Promise<WalletResponse<SendTransactionResponse>>;
}
