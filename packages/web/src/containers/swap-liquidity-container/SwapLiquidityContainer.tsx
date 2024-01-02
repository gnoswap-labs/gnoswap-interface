import SwapLiquidity from "@components/swap/swap-liquidity/SwapLiquidity";
import React, { useMemo } from "react";
import { ValuesType } from "utility-types";
import { SwapFeeTierType } from "@constants/option.constant";
import { useGetPoolList } from "@query/pools";
import { useRouter } from "next/router";
import { PoolModel } from "@models/pool/pool-model";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import { convertToMB } from "@utils/stake-position-utils";
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
  const { wugnotPath, gnot, getGnotPath } = useGnotToGnot();
  const { tokenA, tokenB } = swapValue;
  const router = useRouter();
  const createPool = () => {
    router.push({ pathname: "/earn/add", query: { tokenA: tokenA?.path as string, tokenB: tokenB?.path as string }}, "/earn/add");
  };
  
  const poolDetail: PoolModel[]= useMemo(() => {
    const tokenAPath = tokenA?.path === "gnot" ? wugnotPath : tokenA?.path;
    const tokenBPath = tokenB?.path === "gnot" ? wugnotPath : tokenB?.path;
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
          volume: `$${convertToMB(poolItem[0].volume.toString(), 6)}`,
          liquidity: `$${convertToMB(poolItem[0].tvl.toString(), 2)}`,
          apr: !poolItem[0].apr ? "-" : `${Number(poolItem[0].apr).toFixed(2)}%`,
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
    if (!tokenA) return null;
    return {
      ...tokenA,
      path: getGnotPath(tokenA).path,
      name: getGnotPath(tokenA).name,
      symbol: getGnotPath(tokenA).symbol,
      logoURI: getGnotPath(tokenA).logoURI,
    };
  }, [swapValue.tokenA, gnot]);

  const tokenBData = useMemo(() => {
    if (!tokenB) return null;
    return {
      ...tokenB,
      path: getGnotPath(tokenB).path,
      name: getGnotPath(tokenB).name,
      symbol: getGnotPath(tokenB).symbol,
      logoURI: getGnotPath(tokenB).logoURI,
    };
  }, [tokenB, gnot]);

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