import { TokenModel } from "@models/token/token-model";

export interface TooltipInfo {
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string | null;
  tokenBAmount: string | null;
  tokenAUsd: string | null;
  tokenBUsd: string | null;
  positionTokenAAmount: string | null;
  positionTokenBAmount: string | null;
  positionTokenAUsd: string | null;
  positionTokenBUsd: string | null;
  tokenAVisible: boolean;
  tokenBVisible: boolean;
  positionTokenAVisible: boolean;
  positionTokenBVisible: boolean;
  isPositionActive: boolean;
  positionLiquidityShare: string;
  price: string;
  disabled?: boolean;
}

export interface ReservedBin {
  minTick: number;
  maxTick: number;
  sourceMinTick: number;
  sourceMaxTick: number;
  reserveTokenMap: number;
  positionReserveTokenMap: number;
  reserveTokenAMyAmount: string | null;
  reserveTokenBMyAmount: string | null;
  reserveTokenAVisible: boolean;
  reserveTokenBVisible: boolean;
  positionReserveTokenAVisible: boolean;
  positionReserveTokenBVisible: boolean;
  positionLiquidityShare: string;
  reserveTokenAMap: number;
  index: number;
  liquidity: string;
  reserveTokenA: string | null;
  reserveTokenB: string | null;
  isPositionActive: boolean;
  isPositionVisualActive: boolean;
}
