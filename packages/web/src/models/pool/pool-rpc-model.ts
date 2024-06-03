import { PositionRPCModel } from "./position-rpc-model";

export interface PoolRPCModel {
  poolPath: string;

  tokenAPath: string;

  tokenBPath: string;

  fee: number;

  tokenABalance: bigint;

  tokenBBalance: bigint;

  tickSpacing: number;

  maxLiquidityPerTick: number;

  price: number;

  sqrtPriceX96: bigint;

  tick: number;

  feeProtocol: number;

  tokenAProtocolFee: number;

  tokenBProtocolFee: number;

  liquidity: bigint;

  ticks: number[];

  tickDetails: {
    [key in number]: {
      liquidityGross: number;
      liquidityNet: number;
      feeGrowthOutside0X128: number;
      feeGrowthOutside1X128: number;
      tickCumulativeOutside: number;
      secondsPerLiquidityOutsideX: number;
      secondsOutside: number;
    };
  };

  tickBitmaps: {
    [key in number]: string;
  };

  positions: PositionRPCModel[];
}
