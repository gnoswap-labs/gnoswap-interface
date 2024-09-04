import { useAtom } from "jotai";
import React, { useMemo } from "react";

import useRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolModel } from "@models/pool/pool-model";
import { useGetPoolList } from "@query/pools";
import { SwapState } from "@states/index";
import { formatOtherPrice } from "@utils/new-number-utils";

import SwapLiquidity, {
  dummyLiquidityList,
} from "../../components/swap-liquidity/SwapLiquidity";

const SwapLiquidityContainer: React.FC = () => {
  const [swapValue] = useAtom(SwapState.swap);
  const { data: poolList = [], isLoading } = useGetPoolList();
  const { wugnotPath, gnot, getGnotPath } = useGnotToGnot();
  const { tokenA, tokenB } = swapValue;
  const router = useRouter();

  const createPool = () => {
    router.movePage("EARN_ADD", {
      tokenA: tokenA?.path as string,
      tokenB: tokenB?.path as string,
    });
  };

  const poolDetail: PoolModel[] = useMemo(() => {
    const tokenAPath = tokenA?.path === "gnot" ? wugnotPath : tokenA?.path;
    const tokenBPath = tokenB?.path === "gnot" ? wugnotPath : tokenB?.path;
    const pools: PoolModel[] = poolList.filter(
      (item: PoolModel) =>
        item.poolPath?.includes(`${tokenAPath}:${tokenBPath}`) ||
        item.poolPath?.includes(`${tokenBPath}:${tokenAPath}`),
    );
    return pools;
  }, [poolList, tokenA, tokenB, wugnotPath]);

  const liquidityListRandom = useMemo(() => {
    let count = 0;
    const formattedPoolData = dummyLiquidityList.map(_ => {
      const poolItem = poolDetail.find(
        (item: PoolModel) => Number(item.fee) === Number(_.feeTier) * 10000,
      );
      if (poolItem) {
        count++;
        return {
          ..._,
          volume: formatOtherPrice(poolItem.volume24h),
          liquidity: formatOtherPrice(poolItem.tvl),
          apr: (poolItem?.apr ?? "").toString(),
          active: true,
          id: poolItem.id,
        };
      }
      return _;
    });
    if (count === 0) {
      return [];
    }
    return formattedPoolData;
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
  }, [tokenA, gnot]);

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

  const checkDoubleGnot =
    (tokenAData?.path === "gnot" && tokenBData?.path === "gnot") ||
    (tokenBData?.path === "gnot" && tokenAData?.path === "gnot");

  if (!tokenAData || !tokenBData || isLoading || checkDoubleGnot) return null;

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
