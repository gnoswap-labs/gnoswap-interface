import { TokenModel } from "@models/token/token-model";

export interface PoolLiquidityTickModel {
  tick: number;
  liquidityNet: string;
}

export type PoolLiquidityCurrentTickRelation =
  | "outside-below"
  | "at-lower-boundary"
  | "inside"
  | "at-upper-boundary"
  | "outside-above";

export interface PoolLiquidityTokenAmountModel {
  rawAmount: string;
  displayAmount: string;
}

export interface PoolLiquiditySegmentModel {
  minTick: number;
  maxTick: number;
  amountMinTick: number;
  amountMaxTick: number;
  displayMinTick: number;
  displayMaxTick: number;
  liquidity: string;
  graphHeightRatio: string;
  currentTickRelation: PoolLiquidityCurrentTickRelation;
  isDisplayInverted: boolean;
  tokenAAmount?: PoolLiquidityTokenAmountModel;
  tokenBAmount?: PoolLiquidityTokenAmountModel;
}

export interface PoolLiquiditySegmentBuildOptions {
  currentTick?: number;
  currentSqrtPriceX96?: bigint;
  currentPrice?: number;
  tokenA?: Pick<TokenModel, "path" | "decimals" | "symbol" | "displaySymbol">;
  tokenB?: Pick<TokenModel, "path" | "decimals" | "symbol" | "displaySymbol">;
  displayTokenAPath?: string;
  displayTokenBPath?: string;
  includeTokenAmounts?: boolean;
  visibleTickRange?: number;
  binCount?: number;
}

export interface PoolLiquidityTokenAmountBuildOptions {
  liquidity: string;
  minTick: number;
  maxTick: number;
  currentTick: number;
  currentSqrtPriceX96?: bigint;
  currentPrice?: number;
  tokenA: Pick<TokenModel, "path" | "decimals" | "symbol" | "displaySymbol">;
  tokenB: Pick<TokenModel, "path" | "decimals" | "symbol" | "displaySymbol">;
}

export interface PoolLiquidityDerivedTokenAmounts {
  tokenAAmount: PoolLiquidityTokenAmountModel;
  tokenBAmount: PoolLiquidityTokenAmountModel;
}

export type BuildPoolLiquiditySegmentsFn = (
  ticks: PoolLiquidityTickModel[],
  options?: PoolLiquiditySegmentBuildOptions,
) => PoolLiquiditySegmentModel[];
