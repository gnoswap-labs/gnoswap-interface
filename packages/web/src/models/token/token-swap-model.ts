import { ExactTypeOption } from "@common/values/data-constant";
import { TokenInfo } from "./token-info";

export interface TokenSwapModel {
  tokenA: TokenInfo | null;
  tokenB: TokenInfo | null;
  type: ExactTypeOption;
}
