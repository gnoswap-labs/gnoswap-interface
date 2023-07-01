import {
  InjectResponse,
  InjectSendTransactionRequestParam,
} from "@/common/clients/wallet-client/protocols";
import { Account } from "@gnoswap-labs/gno-client/src/api/response";
import { AccountNotificationRepository } from "./account-notification-repository";
import { AccountInfoResponse } from "./response";

export interface AccountRepository extends AccountNotificationRepository {
  getAccount: () => Promise<InjectResponse<AccountInfoResponse>>;

  getAccountByAddress: (address: string) => Promise<Account>;

  existsWallet: () => boolean;

  addEstablishedSite: () => Promise<InjectResponse<any>>;

  sendTransaction: (
    request: InjectSendTransactionRequestParam,
  ) => Promise<InjectResponse<any>>;
}
