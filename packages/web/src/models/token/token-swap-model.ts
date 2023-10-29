import { SwapDirectionType } from "@common/values/data-constant";
import { TokenModel } from "./token-model";

export interface TokenSwapModel {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  type: SwapDirectionType;
}
