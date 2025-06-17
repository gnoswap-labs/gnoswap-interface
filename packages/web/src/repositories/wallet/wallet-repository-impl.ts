import { WalletClient } from "@common/clients/wallet-client";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";
import { isNativeToken, isNativeTokenByType } from "@models/token/token-model";
import { withTransactionGuard, generateSendTransactionParams } from "@utils/transaction-utils";
import { TransferGRC20TokenRequest } from "./request/transfer-grc20-token-request";
import { TransferNativeTokenRequest } from "./request/transfer-native-token-request";
import { TransferGRC20TokenResponse } from "./response/transfer-grc20-token-response";
import { TransferNativeTokenResponse } from "./response/transfer-native-token-response";
import { WalletRepository } from "./wallet-repository";
import { makeTransferGNOTTokenMessages, makeTransferGRC20TokenMessages } from "./wallet.message";

export class WalletRepositoryImpl implements WalletRepository {
  private walletClient: WalletClient | null;

  constructor(walletClient: WalletClient | null) {
    this.walletClient = walletClient;
  }

  public async transferGNOTToken(
    request: TransferNativeTokenRequest,
  ): Promise<WalletResponse<TransferNativeTokenResponse>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
    }

    if (!isNativeToken(request.token)) {
      throw new Error("Not a native token");
    }

    const { gasFee, gasUsed, ...requests } = request;

    const messages = makeTransferGNOTTokenMessages({ ...requests });

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  public async transferGRC20Token(
    request: TransferGRC20TokenRequest,
  ): Promise<WalletResponse<TransferGRC20TokenResponse>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
    }
    if (isNativeTokenByType(request.token.type)) {
      throw new Error("Not a grc20 token");
    }

    const messages = makeTransferGRC20TokenMessages({ ...request });

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }
}
