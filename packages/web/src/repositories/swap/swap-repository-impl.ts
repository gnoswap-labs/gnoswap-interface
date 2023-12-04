import { StorageClient } from "@common/clients/storage-client";
import { generateNumber } from "@common/utils/test-util";
import {
  SwapExpectedResultResponse,
  SwapFeeResponse,
  SwapRateResponse,
  SwapRepository,
  SwapResponse,
} from ".";
import { SwapRequest } from "./request";
import { WalletClient } from "@common/clients/wallet-client";
import { GnoProvider } from "@gnolang/gno-js-client";
import { MAX_PRICE_X96, MIN_PRICE_X96 } from "@constants/swap.constant";
import {
  evaluateExpressionToObject,
  evaluateExpressionToValues,
  makeABCIParams,
} from "@utils/rpc-utils";
import BigNumber from "bignumber.js";
import { TokenModel } from "@models/token/token-model";
import { FindBestPoolReqeust } from "./request/find-best-pool-request";
import { SwapPoolResponse } from "./response/swap-pool-response";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { CommonError } from "@common/errors";
import { SwapError } from "@common/errors/swap";

const POOL_ADDRESS = process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "";

export class SwapRepositoryImpl implements SwapRepository {
  private localStorageClient: StorageClient;
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(
    walletClient: WalletClient | null,
    rpcProvider: GnoProvider | null,
    localStorageClient: StorageClient,
  ) {
    this.walletClient = walletClient;
    this.rpcProvider = rpcProvider;
    this.localStorageClient = localStorageClient;
  }

  public getSwapRate = async (): Promise<SwapRateResponse> => {
    return {
      rate: generateNumber(0, 100),
    };
  };

  public getSwapFee = async (): Promise<SwapFeeResponse> => {
    return {
      fee: generateNumber(0, 1),
    };
  };

  public findSwapPool = async (
    request: FindBestPoolReqeust,
  ): Promise<SwapPoolResponse> => {
    const poolPackagePath = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH;
    if (!poolPackagePath || !this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }
    const { tokenA, tokenB, amountSpecified, zeroForOne } = request;
    if (Number.isNaN(amountSpecified)) {
      throw new SwapError("INVALID_PARAMS");
    }
    const tokenAPath = tokenA.symbol.toLowerCase();
    const tokenBPath = tokenB.symbol.toLowerCase();
    const param = makeABCIParams("FindBestPool", [tokenAPath, tokenBPath, zeroForOne, amountSpecified]);
    const result = await this.rpcProvider
      .evaluateExpression(poolPackagePath, param)
      .then(evaluateExpressionToObject<{
        response: {
          data: {
            pool_path: string;
            sqrt_price_x96: number;
            tick_spacing: number;
          }
        }
      }>);

    if (result === null) {
      throw new SwapError("NOT_FOUND_SWAP_POOL");
    }
    const poolPath = result.response.data.pool_path;
    const poolPathSplit = poolPath.split("_");
    const feeStr = poolPathSplit[poolPathSplit.length - 1];
    const sqrtPriceX96 = BigNumber(result.response.data.sqrt_price_x96).toString();
    const tickSpacing = result.response.data.tick_spacing;
    const feeTier = makeSwapFeeTier(feeStr);

    return {
      feeTier,
      poolPath,
      sqrtPriceX96,
      tickSpacing
    };
  };

  public getExpectedSwapResult = async (
    request: SwapRequest,
  ): Promise<SwapExpectedResultResponse> => {
    const poolPackagePath = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH;
    if (!poolPackagePath || !this.rpcProvider) {
      return {
        tokenAAmount: 0,
        tokenBAmount: 0,
        priceImpact: 0,
      };
    }
    const {
      tokenA,
      tokenB,
      fee,
      amountSpecified,
      zeroForOne,
      receiver,
    } = request;
    const tokenAPath = tokenA.symbol.toLowerCase();
    const tokenBPath = tokenB.symbol.toLowerCase();
    const priceLimit = zeroForOne ? MIN_PRICE_X96 : MAX_PRICE_X96;
    const param = makeABCIParams("DrySwap", [tokenAPath, tokenBPath, fee, receiver, zeroForOne, amountSpecified, priceLimit.toString()]);
    const result = await this.rpcProvider
      .evaluateExpression(poolPackagePath, param)
      .then(evaluateExpressionToValues);

    if (result.length < 2) {
      return {
        tokenAAmount: 0,
        tokenBAmount: 0,
        priceImpact: 0,
      };
    }

    return {
      tokenAAmount: BigNumber(result[0]).toNumber(),
      tokenBAmount: BigNumber(result[1]).toNumber(),
      priceImpact: 0,
    };
  };

  public getSlippage = (): number => {
    const slippageValue = this.localStorageClient.get("slippage");
    try {
      return parseFloat(slippageValue ?? "0");
    } catch (e) {
      console.error(e);
    }
    return 0;
  };

  public setSlippage = (slippage: string): boolean => {
    this.localStorageClient.set("slippage", `${slippage}`);
    return true;
  };

  public swap = async (swapRequest: SwapRequest): Promise<SwapResponse> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const poolPackagePath = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH;
    const account = await this.walletClient.getAccount();
    if (!account.data || !poolPackagePath) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const {
      tokenA,
      tokenB,
      fee,
      receiver,
      zeroForOne,
      amountSpecified,
    } = swapRequest;
    const priceLimit = zeroForOne
      ? "4295128740"
      : "1461446703485210103287273052203988822378723970341";
    const response = await this.walletClient.sendTransaction({
      messages: [
        SwapRepositoryImpl.makeApproveTokenMessage(tokenA, "", address),
        SwapRepositoryImpl.makeApproveTokenMessage(tokenB, "", address),
        {
          caller: address,
          send: "",
          pkg_path: poolPackagePath,
          func: "Swap",
          args: [
            tokenA.symbol.toLowerCase(),
            tokenB.symbol.toLowerCase(),
            `${fee}`,
            receiver,
            `${zeroForOne}`,
            `${amountSpecified}`,
            priceLimit,
          ],
        },
      ],
      gasWanted: 2000000,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0) {
      throw new SwapError("SWAP_FAILED");
    }
    return {
      tx_hash: response.type,
    };
  };

  private static makeApproveTokenMessage(
    token: TokenModel,
    amount: string,
    caller: string,
  ) {
    return {
      caller,
      send: "",
      pkg_path: token.path,
      func: "Approve",
      args: [POOL_ADDRESS, "999999999999"],
    };
  }
}
