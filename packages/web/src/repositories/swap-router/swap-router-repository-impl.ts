import BigNumber from "bignumber.js";

import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { TransactionMessage, WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { SwapError } from "@common/errors/swap";
import { PACKAGE_ROUTER_PATH } from "@constants/environment.constant";
import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";
import { makeRawTokenAmount } from "@utils/token-utils";
import { getSwapTokenPath } from "@utils/swap-route-utils";

import { getGRC20Allowance } from "@common/clients/gno-provider";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";
import { GnoProvider } from "@gnolang/gno-js-client";
import { generateSendTransactionParams, withTransactionGuard } from "@utils/transaction-utils";
import { GetRoutesRequest } from "./request/get-routes-request";
import { SwapRouteMessagesRequest, SwapRouteRequest } from "./request/swap-route-request";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { WrapTokenMessagesRequest, WrapTokenRequest } from "./request/wrap-token-request";
import { GetRoutesResponse } from "./response/get-routes-response";
import { SwapRouteFailedResponse, SwapRouteSuccessResponse } from "./response/swap-route-response";
import { SwapRouterRepository } from "./swap-router-repository";
import {
  makeExactInSwapRouteMessageWithApproves,
  makeExactOutSwapRouteMessageWithApproves,
  makeUnwrapTokenMessages,
  makeWrapTokenMessages,
} from "./swap-router.message";

export class SwapRouterRepositoryImpl implements SwapRouterRepository {
  private rpcProvider: GnoProvider | null;
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;

  constructor(rpcProvider: GnoProvider | null, walletClient: WalletClient | null, networkClient: NetworkClient | null) {
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
    this.networkClient = networkClient;
  }

  public getRoutes = async (request: GetRoutesRequest): Promise<GetRoutesResponse> => {
    const { inputToken, outputToken, exactType, tokenAmount } = request;

    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    if (BigNumber(tokenAmount).isNaN()) {
      throw new SwapError("INVALID_PARAMS");
    }

    const inputTokenPath = getSwapTokenPath(inputToken);
    const outputTokenPath = getSwapTokenPath(outputToken);

    const tokenAmountRaw =
      exactType === "EXACT_IN"
        ? makeRawTokenAmount(inputToken, tokenAmount)
        : makeRawTokenAmount(outputToken, tokenAmount);

    const response = await this.networkClient.post<
      {
        inputTokenPath: string;
        outputTokenPath: string;
        exactType: string;
        amount: string;
      },
      GetRoutesResponse
    >({
      url: "v1/api/route",
      body: {
        inputTokenPath,
        outputTokenPath,
        exactType,
        amount: String(tokenAmountRaw || 0),
      },
    });

    if (response.status !== 200) {
      throw new SwapError("SWAP_FAILED");
    }

    return response.data;
  };

  private calculateGasWanted(gasUsed?: number): number {
    if (!gasUsed || isNaN(Number(gasUsed)) || Number(gasUsed) <= 0) {
      return DEFAULT_GAS_WANTED;
    }

    return Number(gasUsed);
  }

  public makeExactInSwapRouteMessages = async (request: SwapRouteMessagesRequest): Promise<TransactionMessage[]> => {
    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const address = await this.getAddress();

    return makeExactInSwapRouteMessageWithApproves({ ...request, caller: address }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );
  };

  public makeExactOutSwapRouteMessages = async (request: SwapRouteMessagesRequest): Promise<TransactionMessage[]> => {
    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const address = await this.getAddress();

    return makeExactOutSwapRouteMessageWithApproves({ ...request, caller: address }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );
  };

  public sendExactInSwapRoute = async (
    request: SwapRouteRequest,
  ): Promise<WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>> => {
    const { gasFee, gasUsed, ...requests } = request;

    const messages = await this.makeExactInSwapRouteMessages(requests);

    const gasWanted = this.calculateGasWanted(Number(gasUsed));

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasWanted,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendExactOutSwapRoute = async (
    request: SwapRouteRequest,
  ): Promise<WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>> => {
    const { gasFee, gasUsed, ...requests } = request;

    const messages = await this.makeExactOutSwapRouteMessages(requests);

    const gasWanted = this.calculateGasWanted(Number(gasUsed));

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasWanted,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public makeWrapTokenMessages = async (request: WrapTokenMessagesRequest): Promise<TransactionMessage[]> => {
    const address = await this.getAddress();

    return makeWrapTokenMessages({ ...request, caller: address });
  };

  public sendWrapToken = async (request: WrapTokenRequest): Promise<WalletResponse<{ hash: string }>> => {
    const { gasFee, gasUsed, ...requests } = request;

    const messages = await this.makeWrapTokenMessages(requests);

    const gasWanted = this.calculateGasWanted(Number(gasUsed));

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasWanted,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendUnwrapToken = async (request: UnwrapTokenRequest): Promise<WalletResponse<{ hash: string }>> => {
    const address = await this.getAddress();

    const { gasFee, gasUsed, withNotification, isVisibleResult, ...requests } = request;

    const messages = makeUnwrapTokenMessages({ ...requests, caller: address });

    const gasWanted = this.calculateGasWanted(Number(gasUsed));

    const sendTransactionParams = {
      ...generateSendTransactionParams({
        messages,
        gasWanted,
        gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
        memo: "",
      }),
      withNotification,
      isVisibleResult,
    };

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  callGetSwapFee = async (): Promise<number> => {
    try {
      if (!PACKAGE_ROUTER_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetSwapFee", []);
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_ROUTER_PATH, param);

      return evaluateExpressionToNumber(response);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  private async getAddress(): Promise<string> {
    if (!this.walletClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const address = await this.walletClient.getAddress();
    if (!address) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    return address;
  }
}
