import { SwapDirectionType } from "@common/values/data-constant";
import BigNumber from "bignumber.js";
import { AmountModel } from "@models/common/amount-model";
import { TokenInfo } from "@models/token/token-info";

export interface SwapConfirmModel {
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  tokenAAmount: AmountModel;
  tokenBAmount: AmountModel;
  type: SwapDirectionType;
  slippage: number;
  gasFee: BigNumber;
}

export interface SwapConfirmSuccessModel {
  txHash: string;
}
