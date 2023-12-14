import { RewardResposne } from "./reward-response";

export type PositionListResponse = PositionResponse[];

export interface PositionResponse {
  lpTokenId: string;

  poolPath: string;

  staked: boolean;

  incentivized: boolean;

  operator: string;

  tickLower: string;

  tickUpper: string;

  liquidity: string;

  token0Balance: string;

  token1Balance: string;

  positionUsdValue: string;

  unclaimedFee0Amount: string;

  unclaimedFee1Amount: string;

  unclaimedFee0Usd: string;

  unclaimedFee1Usd: string;

  tokensOwed0Amount: string;

  tokensOwed1Amount: string;

  tokensOwed0Usd: string;

  tokensOwed1Usd: string;

  apr?: number;

  stakedAt?: String;

  stakedUsdValue?: string;

  rewards?: RewardResposne[];

  dailyRewards?: RewardResposne[];
}
