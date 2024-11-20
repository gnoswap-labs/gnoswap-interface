import BigNumber from "bignumber.js";

import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { SwapError } from "@common/errors/swap";
import { PACKAGE_ROUTER_PATH } from "@constants/environment.constant";
import { checkGnotPath } from "@utils/common";
import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";
import { makeRawTokenAmount } from "@utils/token-utils";

import { getGRC20Allowance } from "@common/clients/gno-provider";
import { DEFAULT_GAS_FEE } from "@common/values";
import { GnoProvider } from "@gnolang/gno-js-client";
import { GetRoutesRequest } from "./request/get-routes-request";
import { SwapRouteRequest } from "./request/swap-route-request";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { WrapTokenRequest } from "./request/wrap-token-request";
import { GetRoutesResponse } from "./response/get-routes-response";
import { SwapRouteFailedResponse, SwapRouteSuccessResponse } from "./response/swap-route-response";
import { SwapRouterRepository } from "./swap-router-repository";
import {
  makeSwapRouteMessageWithApproves,
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

    if (response.status !== 201) {
      throw new SwapError("SWAP_FAILED");
    }

    return response.data;
  };

  public sendSwapRoute = async (
    request: SwapRouteRequest,
  ): Promise<WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>> => {
    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const address = await this.getAddress();

    const messages = await makeSwapRouteMessageWithApproves(
      { ...request, caller: address },
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    return await this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendWrapToken = async (request: WrapTokenRequest): Promise<WalletResponse<{ hash: string }>> => {
    const address = await this.getAddress();

    const messages = makeWrapTokenMessages({ ...request, caller: address });

    return await this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendUnwrapToken = async (request: UnwrapTokenRequest): Promise<WalletResponse<{ hash: string }>> => {
    const address = await this.getAddress();

    const messages = makeUnwrapTokenMessages({ ...request, caller: address });

    return await this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
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
