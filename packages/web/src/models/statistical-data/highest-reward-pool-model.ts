import { TokenPairModel } from "@models/token/token-pair-model";
export interface HighestRewardPoolModel {
  hits: number;
  total: number;
  pairs: Array<SummaryHighestPairType>;
}

export interface SummaryHighestPairType {
  poolId: string;
  feeTier: number;
  apr: number;
  tokenPair: TokenPairModel;
}
