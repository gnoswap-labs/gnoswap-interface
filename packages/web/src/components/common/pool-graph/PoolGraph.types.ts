import { TokenModel } from "@models/token/token-model";

export interface TooltipInfo {
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string | null;
  tokenBAmount: string | null;
  depositTokenAAmount: string | null;
  depositTokenBAmount: string | null;
  tokenARange: {
    min: string | null;
    max: string | null;
  };
  tokenBRange: {
    min: string | null;
    max: string | null;
  };
  tokenAPrice: string;
  tokenBPrice: string;
  disabled?: boolean;
}

export interface ReservedBin {
  minTick: number;
  maxTick: number;
  reserveTokenMap: number;
  minTickSwap: number;
  maxTickSwap: number;
  reserveTokenAMyAmount: number;
  reserveTokenBMyAmount: number;
  reserveTokenAMap: number;
  index: number;
  liquidity: number;
  reserveTokenA: number;
  reserveTokenB: number;
}
