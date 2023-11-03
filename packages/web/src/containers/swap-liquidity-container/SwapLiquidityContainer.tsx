import SwapLiquidity from "@components/swap/swap-liquidity/SwapLiquidity";
import React from "react";
import { ValuesType } from "utility-types";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import useNavigate from "@hooks/common/use-navigate";
import { SwapFeeTierType } from "@constants/option.constant";
export interface LiquidityInfo {
  feeTier: string;
  volume: string;
  liquidity: string;
  apr: string;
  feeTierType: SwapFeeTierType;
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
    feeTier: "0.01",
    volume: "$25.45M",
    liquidity: "$25.45M",
    apr: "245.24%",
    feeTierType: "FEE_100",
  },
  {
    feeTier: "0.05",
    volume: "$15.45M",
    liquidity: "$225.45M",
    apr: "245.24%",
    feeTierType: "FEE_500",
  },
  {
    feeTier: "0.3",
    volume: "-",
    liquidity: "-",
    apr: "-",
    feeTierType: "FEE_3000",
  },
  {
    feeTier: "1",
    volume: "-",
    liquidity: "-",
    apr: "-",
    feeTierType: "FEE_10000",
  },
];

const TEMP_DATA = [dummyLiquidityList, []];

const SwapLiquidityContainer: React.FC = () => {
  const [swapValue] = useAtom(SwapState.swap);
  const navigator = useNavigate();

  const createPool = () => {
    navigator.push("/earn/add");
  };
  const liquidityListRandom = TEMP_DATA[Math.floor(Math.random() * 2)];

  if (!swapValue.tokenA || !swapValue.tokenB) return null;

  return (
    <SwapLiquidity
      liquiditys={liquidityListRandom}
      tokenA={swapValue.tokenA}
      tokenB={swapValue.tokenB}
      createPool={createPool}
    />
  );
};

export default SwapLiquidityContainer;
