import { TokenModel } from "@models/token/token-model";
import POOLS from "@repositories/pool/mock/pools.json";
import { Meta, StoryObj } from "@storybook/nextjs";
import { buildPoolLiquiditySegments } from "@utils/pool-liquidity-utils";
import PoolGraph, { type PoolGraphProps } from "./PoolGraph";

const rawPool = POOLS.pools[0];
const tokenA: TokenModel = {
  ...rawPool.tokenA,
  type: "GRC20",
  displaySymbol: rawPool.tokenA.symbol,
};
const tokenB: TokenModel = {
  ...rawPool.tokenB,
  type: "GRC20",
  displaySymbol: rawPool.tokenB.symbol,
};
const liquiditySegments = buildPoolLiquiditySegments(
  [
    { tick: -20, liquidityNet: "1000000000000000000" },
    { tick: 0, liquidityNet: "500000000000000000" },
    { tick: 20, liquidityNet: "-1500000000000000000" },
  ],
  {
    currentTick: 18,
    tokenA,
    tokenB,
    includeTokenAmounts: true,
  },
);

export default {
  title: "common/PoolGraph",
  component: PoolGraph,
} as Meta<typeof PoolGraph>;

export const Default: StoryObj<PoolGraphProps> = {
  args: {
    tokenA,
    tokenB,
    liquiditySegments,
    mouseover: true,
    currentTick: 18,
    width: 600,
    height: 400,
  },
};
