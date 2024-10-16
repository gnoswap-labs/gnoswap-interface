import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { TransferGRC20TokenRequest } from "./request/transfer-grc20-token-request";
import { TransferNativeTokenRequest } from "./request/transfer-native-token-request";
import { TransferGRC20TokenResponse } from "./response/transfer-grc20-token-response";
import { TransferNativeTokenResponse } from "./response/transfer-native-token-response";

export interface WalletRepository {
  transferGNOTToken: (
    request: TransferNativeTokenRequest,
  ) => Promise<WalletResponse<TransferNativeTokenResponse>>;

  transferGRC20Token: (
    request: TransferGRC20TokenRequest,
  ) => Promise<WalletResponse<TransferGRC20TokenResponse>>;
}
