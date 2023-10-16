import { AmountModel } from "@models/common/amount-model";
import { TokenPairInfo } from "./token-pair-info";

export interface TokenPairAmountInfo extends TokenPairInfo {
  tokenAAmount: AmountModel;
  tokenBAmount: AmountModel;
}
