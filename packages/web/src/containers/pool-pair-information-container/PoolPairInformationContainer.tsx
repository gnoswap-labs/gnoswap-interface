import React, { useMemo } from "react";
import { useRouter } from "next/router";
import PoolPairInformation from "@components/pool/pool-pair-information/PoolPairInformation";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetPoolDetailByPath } from "@query/pools";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { useLoading } from "@hooks/common/use-loading";

export interface pathProps {
  title: string;
  path: string;
}

export const menu = {
  title: "Earn",
  path: "/earn",
};

const initialPool: PoolDetailModel = {
  name: "",
  path: "",
  tokenA: {
    chainId: "",
    createdAt: "",
    name: "",
    address: "",
    path: "",
    decimals: 4,
    symbol: "",
    logoURI: "",
    type: "native",
    priceId: "",
  },
  tokenB: {
    chainId: "",
    createdAt: "",
    name: "",
    address: "",
    path: "",
    decimals: 4,
    symbol: "",
    logoURI: "",
    type: "native",
    priceId: "",
  },
  incentivizedType: "INCENTIVIZED",
  tvl: 0,
  tvlChange: 0,
  volume: 0,
  volumeChange: 0,
  totalVolume: 0,
  id: "",
  apr: 0,
  fee: "",
  feeVolume: 0,
  feeChange: 0,
  currentTick: 0,
  price: 0,
  tokenABalance: 0,
  tokenBBalance: 0,
  tickSpacing: 0,
  bins: [],
  rewardTokens: [],
  poolPath: ""
};


const PoolPairInformationContainer = () => {
  const router = useRouter();
  const { getGnotPath } = useGnotToGnot();
  const poolPath = router.query["pool-path"] || "";
  const { data = initialPool as PoolDetailModel, isLoading: loading } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });
  const { isLoadingCommon } = useLoading();
  const onClickPath = (path: string) => {
    router.push(path);
  };
  
  const pool = useMemo(() => {
    return {
      ...data,
      tokenA: {
        ...data.tokenA,
        path: getGnotPath(data.tokenA).path,
        name: getGnotPath(data.tokenA).name,
        symbol: getGnotPath(data.tokenA).symbol,
        logoURI: getGnotPath(data.tokenA).logoURI,
      },
      tokenB: {
        ...data.tokenB,
        path: getGnotPath(data.tokenB).path,
        name: getGnotPath(data.tokenB).name,
        symbol: getGnotPath(data.tokenB).symbol,
        logoURI: getGnotPath(data.tokenB).logoURI,
      },
    };
  }, [data]);

  const feeStr = useMemo(() => {
    if (!pool?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(pool.fee)].rateStr;
  }, [pool?.fee]);

  return (
    <PoolPairInformation
      pool={pool}
      menu={menu}
      onClickPath={onClickPath}
      feeStr={feeStr}
      loading={loading || isLoadingCommon}
    />
  );
};

export default PoolPairInformationContainer;