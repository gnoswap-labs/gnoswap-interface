export interface PositionRPCModel {
  owner: string;

  tickLower: number;

  tickUpper: number;

  liquidity: bigint;

  tokenAOwed: bigint;

  tokenBOwed: bigint;
}
