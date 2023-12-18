import SwapLiquidity from "@components/swap/swap-liquidity/SwapLiquidity";
import React, { useMemo } from "react";
import { ValuesType } from "utility-types";
import { SwapFeeTierType } from "@constants/option.constant";
import { useGetPoolList } from "@query/pools";
import { useRouter } from "next/router";
import { PoolModel } from "@models/pool/pool-model";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import { convertLargePrice } from "@utils/stake-position-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

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
  const { data: poolList = [], isLoading } = useGetPoolList();
  const { wugnotPath, gnot } = useGnotToGnot();

  const router = useRouter();
  const { tokenA, tokenB } = router.query;
  const createPool = () => {
    router.push({ pathname: "/earn/add", query: { tokenA: tokenA as string, tokenB: tokenB as string }}, "/earn/add");
  };
  
  const poolDetail: PoolModel[]= useMemo(() => {
    const tokenAPath = tokenA === "gnot" ? wugnotPath : tokenA;
    const tokenBPath = tokenB === "gnot" ? wugnotPath : tokenB;
    const pools: PoolModel[] = poolList.filter((item: PoolModel) => (item.poolPath?.includes(`${tokenAPath}:${tokenBPath}`) || item.poolPath?.includes(`${tokenBPath}:${tokenAPath}`)));
    return pools;
  }, [poolList, tokenA, tokenB, wugnotPath]);
  
  const liquidityListRandom = useMemo(() => {
    let count = 0;
    const temp = dummyLiquidityList.map((_) => {
      const poolItem = poolDetail.filter((item: PoolModel) => Number(item.fee) === Number(_.feeTier) * 10000);
      if (poolItem.length > 0) {
        count++;
        return {
          ..._,
          volume: `$${convertLargePrice(poolItem[0].volume.toString(), 6)}`,
          liquidity: `$${convertLargePrice(poolItem[0].tvl.toString(), 2)}`,
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
  
  const tokenAData = useMemo(() => {
    if (!swapValue.tokenA) return null;
    return {
      ...swapValue.tokenA,
      path: swapValue.tokenA?.path === wugnotPath ? (gnot?.path || "") : (swapValue.tokenA?.path || ""),
      name: swapValue.tokenA?.path === wugnotPath ? (gnot?.name || "") : (swapValue.tokenA?.name || ""),
      symbol: swapValue.tokenA?.path === wugnotPath ? (gnot?.symbol || "") : (swapValue.tokenA?.symbol || ""),
      logoURI: swapValue.tokenA?.path === wugnotPath ? (gnot?.logoURI || "") : (swapValue.tokenA?.logoURI || ""),
    };
  }, [swapValue.tokenA, gnot]);

  const tokenBData = useMemo(() => {
    if (!swapValue.tokenB) return null;
    return {
      ...swapValue.tokenB,
      path: swapValue.tokenB?.path === wugnotPath ? (gnot?.path || "") : (swapValue.tokenB?.path || ""),
      name: swapValue.tokenB?.path === wugnotPath ? (gnot?.name || "") : (swapValue.tokenB?.name || ""),
      symbol: swapValue.tokenB?.path === wugnotPath ? (gnot?.symbol || "") : (swapValue.tokenB?.symbol || ""),
      logoURI: swapValue.tokenB?.path === wugnotPath ? (gnot?.logoURI || "") : (swapValue.tokenB?.logoURI || ""),
    };
  }, [swapValue.tokenB, gnot]);

  if (!tokenAData || !tokenBData || isLoading) return null;
  
  return (
    <SwapLiquidity
      liquiditys={liquidityListRandom}
      tokenA={tokenAData}
      tokenB={tokenBData}
      createPool={createPool}
    />
  );
};

export default SwapLiquidityContainer;
