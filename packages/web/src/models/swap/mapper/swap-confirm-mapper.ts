import { amountEmptyNumberInit } from "@common/values/global-initial-value";
import {
  SwapConfirmModel,
  SwapConfirmSuccessModel,
} from "@models/swap/swap-confirm-model";
import { SwapRequest } from "@repositories/swap/request";
import { SwapResponse } from "@repositories/swap";

export class SwapConfirmMapper {
  public static toConfirmRequest(model: SwapConfirmModel): SwapRequest {
    const { tokenPair, type, slippage, gasFee } = model;
    return {
      token0: {
        tokenId: tokenPair.token0.tokenId,
        amount: tokenPair.token0.amount
          ? Number(tokenPair.token0.amount.value)
          : amountEmptyNumberInit.value,
      },
      token1: {
        tokenId: tokenPair.token1.tokenId,
        amount: tokenPair.token1.amount
          ? Number(tokenPair.token1.amount.value)
          : amountEmptyNumberInit.value,
      },
      type,
      slippage,
      gasFee: Number(gasFee),
    };
  }

  public static fromConfirmResponse(
    response: SwapResponse,
  ): SwapConfirmSuccessModel {
    return {
      txHash: response.tx_hash,
    };
  }
}
