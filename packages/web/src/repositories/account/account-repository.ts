import {
  InjectResponse,
  InjectSendTransactionRequestParam,
} from "@common/clients/wallet-client/protocols";
import { AccountNotificationRepository } from "./account-notification-repository";
import { AccountInfoResponse } from "./response";

export interface AccountRepository extends AccountNotificationRepository {
  getAccount: () => Promise<InjectResponse<AccountInfoResponse>>;

  existsWallet: () => boolean;

  addEstablishedSite: () => Promise<InjectResponse<any>>;

  sendTransaction: (
    request: InjectSendTransactionRequestParam,
  ) => Promise<InjectResponse<any>>;
}
