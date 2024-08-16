import BigNumber from "bignumber.js";

import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import {
  SendTransactionErrorResponse,
  SendTransactionSuccessResponse,
  WalletResponse
} from "@common/clients/wallet-client/protocols";
import { TransactionMessage } from "@common/clients/wallet-client/transaction-messages";
import {
  makePoolTokenApproveMessage,
  makeRouterTokenApproveMessage
} from "@common/clients/wallet-client/transaction-messages/pool";
import {
  makeDepositMessage,
  makeWithdrawMessage
} from "@common/clients/wallet-client/transaction-messages/token";
import { CommonError } from "@common/errors";
import { SwapError } from "@common/errors/swap";
import { TokenError } from "@common/errors/token";
import { PACKAGE_ROUTER_PATH } from "@constants/environment.constant";
import { GnoProvider } from "@gnolang/gno-js-client";
import { isNativeToken } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";
import { MAX_UINT64 } from "@utils/math.utils";
import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";
import { makeRoutesQuery } from "@utils/swap-route-utils";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";

import { GetRoutesRequest } from "./request/get-routes-request";
import { SwapRouteRequest } from "./request/swap-route-request";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { WrapTokenRequest } from "./request/wrap-token-request";
import { GetRoutesResponse } from "./response/get-routes-response";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse
} from "./response/swap-route-response";
import { SwapRouterRepository } from "./swap-router-repository";

export class SwapRouterRepositoryImpl implements SwapRouterRepository {
  private rpcProvider: GnoProvider | null;
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;

  constructor(
    rpcProvider: GnoProvider | null,
    walletClient: WalletClient | null,
    networkClient: NetworkClient | null,
  ) {
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
    this.networkClient = networkClient;
  }

  public getRoutes = async (
    request: GetRoutesRequest,
  ): Promise<GetRoutesResponse> => {
    const { inputToken, outputToken, exactType, tokenAmount } = request;

    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    if (BigNumber(tokenAmount).isNaN()) {
      throw new SwapError("INVALID_PARAMS");
    }

    const inputTokenPath = checkGnotPath(inputToken.path);
    const outputTokenPath = checkGnotPath(outputToken.path);

    const tokenAmountRaw =
      exactType === "EXACT_IN"
        ? makeRawTokenAmount(inputToken, tokenAmount)
        : makeRawTokenAmount(inputToken, tokenAmount);

    const response = await this.networkClient.post<
      {
        inputTokenPath: string;
        outputTokenPath: string;
        exactType: string;
        amount: number;
      },
      GetRoutesResponse
    >({
      url: "routes",
      body: {
        inputTokenPath,
        outputTokenPath,
        exactType,
        amount: Number(tokenAmountRaw || 0),
      },
    });

    if (response.status !== 201) {
      throw new SwapError("SWAP_FAILED");
    }

    return response.data;
  };

  public sendSwapRoute = async (
    request: SwapRouteRequest,
  ): Promise<
    WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>
  > => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_ROUTER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const {
      inputToken,
      outputToken,
      exactType,
      tokenAmount,
      estimatedRoutes,
      tokenAmountLimit,
    } = request;

    const targetToken = exactType === "EXACT_IN" ? inputToken : outputToken;
    const resultToken = exactType === "EXACT_IN" ? outputToken : inputToken;
    const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
    const tokenAmountLimitRaw =
      makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
    const routesQuery = makeRoutesQuery(
      estimatedRoutes,
      checkGnotPath(inputToken.path),
    );
    const quotes = estimatedRoutes.map(route => route.quote).join(",");

    const inputTokenWrappedPath = checkGnotPath(inputToken.path);
    const outputTokenWrappedPath = checkGnotPath(outputToken.path);

    const approveMessages: TransactionMessage[] = [
      makePoolTokenApproveMessage(
        inputTokenWrappedPath,
        MAX_UINT64.toString(),
        address,
      ),
      makeRouterTokenApproveMessage(
        inputTokenWrappedPath,
        MAX_UINT64.toString(),
        address,
      ),
      makeRouterTokenApproveMessage(
        outputTokenWrappedPath,
        MAX_UINT64.toString(),
        address,
      ),
    ];

    const sendTokenAmount =
      exactType === "EXACT_IN" ? tokenAmountRaw : tokenAmountLimitRaw;

    const send = inputToken.path === "gnot" ? `${sendTokenAmount}ugnot` : "";

    const swapMessage = {
      caller: address,
      send,
      pkg_path: PACKAGE_ROUTER_PATH,
      func: "SwapRoute",
      args: [
        inputToken.path,
        outputToken.path,
        `${tokenAmountRaw || 0}`,
        exactType,
        `${routesQuery}`,
        `${quotes}`,
        tokenAmountLimitRaw,
      ],
    };

    const messages = [...approveMessages, swapMessage];
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0 || !response.data) {
      const { hash } = response.data as SendTransactionErrorResponse;
      return {
        ...response,
        data: { hash: hash },
      };
    }
    const { data, hash, height } =
      response.data as SendTransactionSuccessResponse<string[]>;
    if (data === null || data.length === 0) {
      return {
        ...response,
        data: {
          hash: hash,
          height: height,
          resultToken,
          resultAmount: "0",
          slippageAmount: "0",
        },
      };
    }

    const result = exactType === "EXACT_IN" ? data[1] : data[0];
    const resultAmount =
      makeDisplayTokenAmount(
        resultToken,
        BigNumber(result).abs().toString(),
      )?.toString() || "0";
    const slippageAmount =
      makeDisplayTokenAmount(
        resultToken,
        sendTokenAmount.toString(),
      )?.toString() || "0";

    return {
      ...response,
      data: {
        hash: hash,
        height: height,
        resultToken,
        resultAmount: resultAmount,
        slippageAmount,
      },
    };
  };

  public sendWrapToken = async (
    request: WrapTokenRequest,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_ROUTER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const { token, tokenAmount } = request;

    const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";

    const messages = [];
    if (!isNativeToken(token)) {
      throw new TokenError("FAILED_WRAP_TOKEN");
    }
    messages.push(
      makeDepositMessage(token.wrappedPath, tokenAmountRaw, "ugnot", address),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendUnwrapToken = async (
    request: UnwrapTokenRequest,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_ROUTER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const { token, tokenAmount } = request;

    const tokenPath = isNativeToken(token) ? token.wrappedPath : token.path;
    const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";

    const messages = [];
    messages.push(makeWithdrawMessage(tokenPath, tokenAmountRaw, address));
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  callGetSwapFee = async (): Promise<number> => {
    try {
      if (!PACKAGE_ROUTER_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetSwapFee", []);
      const response = await this.rpcProvider.evaluateExpression(
        PACKAGE_ROUTER_PATH,
        param,
      );

      return evaluateExpressionToNumber(response);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };
}
