import { TokenPairModel } from "@models/token/token-pair-model";
export interface RecentlyAddedPoolModel {
  hits: number;
  total: number;
  pairs: Array<SummaryRecentlyPairType>;
}

export interface SummaryRecentlyPairType {
  poolId: string;
  feeTier: number;
  apr: number;
  tokenPair: TokenPairModel;
}
