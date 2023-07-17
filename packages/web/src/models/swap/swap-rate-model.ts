import { TokenDefaultModel } from "@models/token/token-default-model";
import { ExactTypeOption } from "@common/values/data-constant";
export interface SwapRateModel {
  token0: TokenDefaultModel;
  token1: TokenDefaultModel;
  type: ExactTypeOption;
}
