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
import { evaluateExpressionToValues } from "@utils/rpc-utils";
import BigNumber from "bignumber.js";
import { TokenModel } from "@models/token/token-model";

const POOL_ADDRESS = process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "";

export class SwapRepositoryImpl implements SwapRepository {
  private localStorageClient: StorageClient;
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient;

  constructor(
    walletClient: WalletClient,
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
    const priceLimit = zeroForOne ? MIN_PRICE_X96 : MAX_PRICE_X96;
    const params = `DrySwap("${tokenA}", "${tokenB}", ${fee}, "${receiver}", ${zeroForOne}, ${amountSpecified}, ${priceLimit})`;
    const result = await this.rpcProvider
      .evaluateExpression(poolPackagePath, params)
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

  public setSlippage = (slippage: number): boolean => {
    this.localStorageClient.set("slippage", `${slippage}`);
    return true;
  };

  public swap = async (swapRequest: SwapRequest): Promise<SwapResponse> => {
    const poolPackagePath = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH;
    const account = await this.walletClient.getAccount();
    if (!account.data || !poolPackagePath) {
      throw new Error("Swap failed.");
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
      throw new Error("Swap failed.");
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
