import { SwapFeeTierType } from "@constants/option.constant";
import { POOL_TYPE } from "@containers/pool-list-container/PoolListContainer";
import { TokenModel } from "@models/token/token-model";
import { PoolRewardInfo } from "./pool-reward-info";

export interface PoolListInfo {
  poolId: string;

  tokenA: TokenModel;

  tokenB: TokenModel;

  feeTier: SwapFeeTierType;

  liquidity: string;

  apr: string;

  volume24h: string;

  fees24h: string;

  rewards: PoolRewardInfo[];

  incentiveType: POOL_TYPE;

  tickInfo: {
    ticks: string[];

    currentTick: number;
  };
}
