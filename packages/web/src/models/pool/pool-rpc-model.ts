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

  tickBitmaps: { [key in number]: bigint };

  positions: PositionRPCModel[];
}
