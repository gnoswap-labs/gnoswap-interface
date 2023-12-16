import SwapLiquidity from "@components/swap/swap-liquidity/SwapLiquidity";
import React, { useMemo } from "react";
import { ValuesType } from "utility-types";
import useNavigate from "@hooks/common/use-navigate";
import { SwapFeeTierType } from "@constants/option.constant";
import { useGetPoolList } from "@query/pools";
import { useRouter } from "next/router";
import { PoolModel } from "@models/pool/pool-model";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import { convertLargePrice } from "@utils/stake-position-utils";

export interface LiquidityInfo {
  feeTier: string;
  volume: string;
  liquidity: string;
  apr: string;
  feeTierType: SwapFeeTierType;
  active: boolean;
  id: string;
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
    volume: "-",
    liquidity: "-",
    apr: "-",
    feeTierType: "FEE_100",
    active: false,
    id: "",
  },
  {
    feeTier: "0.05",
    volume: "-",
    liquidity: "-",
    apr: "-",
    feeTierType: "FEE_500",
    active: false,
    id: "",
  },
  {
    feeTier: "0.3",
    volume: "-",
    liquidity: "-",
    apr: "-",
    feeTierType: "FEE_3000",
    active: false,
    id: "",
  },
  {
    feeTier: "1",
    volume: "-",
    liquidity: "-",
    apr: "-",
    feeTierType: "FEE_10000",
    active: false,
    id: "",
  },
];

const SwapLiquidityContainer: React.FC = () => {
  const [swapValue] = useAtom(SwapState.swap);
  const navigator = useNavigate();
  const { data: poolList = [], isLoading } = useGetPoolList();

  const { query } = useRouter();
  const { tokenA, tokenB } = query;
  const createPool = () => {
    navigator.push("/earn/add");
  };
  
  const poolDetail: PoolModel[]= useMemo(() => {
    const pools: PoolModel[] = poolList.filter((item: PoolModel) => (item.poolPath?.includes(`${tokenA}:${tokenB}`) || item.poolPath?.includes(`${tokenB}:${tokenA}`)));
    return pools;
  }, [poolList, tokenA, tokenB]);
  
  const liquidityListRandom = useMemo(() => {
    let count = 0;
    const temp = dummyLiquidityList.map((_) => {
      const poolItem = poolDetail.filter((item: PoolModel) => Number(item.fee) === Number(_.feeTier) * 10000);
      if (poolItem.length > 0) {
        count++;
        return {
          ..._,
          volume: `$${convertLargePrice(poolItem[0].volume.toString(), 6)}`,
          liquidity: `$${convertLargePrice(poolItem[0].tvl.toString(), 6)}`,
          apr: poolItem[0].apr === "" ? "-" : `${Number(poolItem[0].apr).toFixed(2)}%`,
          active: true,
          id: poolItem[0].id,
        };
      }
      return _;
    });
    if (count === 0) {
      return [];
    }
    return temp;
  }, [poolDetail]);
  
  if (!swapValue.tokenA || !swapValue.tokenB || isLoading) return null;
  
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
