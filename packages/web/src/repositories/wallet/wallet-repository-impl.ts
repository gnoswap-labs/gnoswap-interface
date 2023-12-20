import { WalletClient } from "@common/clients/wallet-client";
import { TransferGRC20TokenRequest } from "./request/transfer-grc20-token-request";
import { TransferNativeTokenRequest } from "./request/transfer-native-token-request";
import { TransferGRC20TokenResponse } from "./response/transfer-grc20-token-response";
import { TransferNativeTokenResponse } from "./response/transfer-native-token-response";
import { WalletRepository } from "./wallet-repository";
import { CommonError } from "@common/errors";
import { isNativeToken } from "@models/token/token-model";
import {
  makeTransferGRC20TokenMessage,
  makeTransferNativeTokenMessage,
} from "@common/clients/wallet-client/transaction-messages/token";
import { SendTransactionSuccessResponse } from "@common/clients/wallet-client/protocols";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";

export class WalletRepositoryImpl implements WalletRepository {
  private walletClient: WalletClient | null;

  constructor(walletClient: WalletClient | null) {
    this.walletClient = walletClient;
  }

  public async transferGNOTToken(
    request: TransferNativeTokenRequest,
  ): Promise<TransferNativeTokenResponse> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
    }
    const { token, tokenAmount, fromAddress, toAddress } = request;
    if (!isNativeToken(token)) {
      throw new Error("Not a native token");
    }

    const messages = [];
    messages.push(
      makeTransferNativeTokenMessage(
        tokenAmount.toString(),
        "ugnot",
        fromAddress,
        toAddress,
      ),
    );
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });

    const response = result.data as SendTransactionSuccessResponse;
    if (!response.hash) {
      throw new Error(JSON.stringify(result));
    }
    return { ...response };
  }

  public async transferGRC20Token(
    request: TransferGRC20TokenRequest,
  ): Promise<TransferGRC20TokenResponse> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
    }
    const { token, tokenAmount, fromAddress, toAddress } = request;
    if (token.type !== "grc20") {
      throw new Error("Not a grc20 token");
    }

    const messages = [];
    messages.push(
      makeTransferGRC20TokenMessage(
        token.path,
        tokenAmount.toString(),
        fromAddress,
        toAddress,
      ),
    );
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const response = result.data as SendTransactionSuccessResponse;
    if (!response.hash) {
      throw new Error(JSON.stringify(result));
    }
    return { ...response };
  }
}
