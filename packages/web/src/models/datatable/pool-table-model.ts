import { TokenPairModel } from "@models/token/token-pair-model";
import { IncentivizedOptions, FeeOptions } from "@common/values/data-constant";
import BigNumber from "bignumber.js";

export interface PoolTableModel {
  hits: number;
  total: number;
  pools: Array<PoolDetailType>;
}

interface PoolDetailType {
  poolId: string;
  tokenPair: TokenPairModel;
  feeRate: FeeOptions;
  liquidity: BigNumber;
  apr: BigNumber;
  volume24h: BigNumber;
  fees24h: BigNumber;
  rewards: Array<string>;
  incentiveType: IncentivizedOptions;
}
