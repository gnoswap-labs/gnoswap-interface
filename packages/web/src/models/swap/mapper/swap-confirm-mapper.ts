import {
  SwapConfirmModel,
  SwapConfirmSuccessModel,
} from "@models/swap/swap-confirm-model";
import { SwapRequest } from "@repositories/swap/request";
import { SwapResponse } from "@repositories/swap";

export class SwapConfirmMapper {
  public static toConfirmRequest(model: SwapConfirmModel): SwapRequest {
    const {
      tokenA,
      tokenAAmount,
      tokenB,
      tokenBAmount,
      type,
      slippage,
      gasFee,
    } = model;
    return {
      tokenA: {
        path: tokenA.path,
        amount: tokenAAmount.amount,
      },
      tokenB: {
        path: tokenB.path,
        amount: tokenBAmount.amount,
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
