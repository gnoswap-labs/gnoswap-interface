import SwapLiquidity from "@components/swap/swap-liquidity/SwapLiquidity";
import React from "react";
import { ValuesType } from "utility-types";

export interface LiquidityInfo {
  feeTier: string;
  volume: string;
  liquidity: string;
  apr: string;
}

export const LIQUIDITY_HEAD = {
  FEETIER: "Fee Tier",
  VOLUME: "Volume (24h)",
  LIQUIDITY: "Liquidity",
  APR: "APR",
} as const;
export type LIQUIDITY_HEAD = ValuesType<typeof LIQUIDITY_HEAD>;

export const dummyLiquidityList: LiquidityInfo[] = [
  {
    feeTier: "0.01%",
    volume: "$25.45M",
    liquidity: "$25.45M",
    apr: "245.24%",
  },
  {
    feeTier: "0.05%",
    volume: "$15.45M",
    liquidity: "$225.45M",
    apr: "245.24%",
  },
  {
    feeTier: "0.3%",
    volume: "-",
    liquidity: "-",
    apr: "-",
  },
  {
    feeTier: "1%",
    volume: "-",
    liquidity: "-",
    apr: "-",
  },
];

const SwapLiquidityContainer: React.FC = () => {
  return <SwapLiquidity liquiditys={dummyLiquidityList} />;
};

export default SwapLiquidityContainer;
