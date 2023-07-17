import { ExactTypeOption } from "@common/values/data-constant";
import { TokenDefaultModel } from "./token-default-model";

export interface TokenSwapModel {
  token0: TokenDefaultModel | null;
  token1: TokenDefaultModel | null;
  type: ExactTypeOption;
}
