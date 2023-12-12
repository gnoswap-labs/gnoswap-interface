import { TokenModel } from "@models/token/token-model";

export interface PositionAPRInfo {
  token: TokenModel;
  tokenAmountOf7d: number;
  aprOf7d: number;
}
