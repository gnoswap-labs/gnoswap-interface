import { TokenPairModel } from "@models/token/token-pair-model";
import { ExactTypeOption } from "@common/values/data-constant";
import BigNumber from "bignumber.js";

export interface SwapConfirmModel {
  tokenPair: TokenPairModel;
  type: ExactTypeOption;
  slippage: number;
  gasFee: BigNumber;
}

export interface SwapConfirmSuccessModel {
  txHash: string;
}
