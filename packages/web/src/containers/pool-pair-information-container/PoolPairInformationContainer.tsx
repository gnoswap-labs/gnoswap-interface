import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import PoolPairInformation from "@components/pool/pool-pair-information/PoolPairInformation";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export interface pathProps {
  title: string;
  path: string;
}

export const menu = {
  title: "Earn",
  path: "/earn",
};

const PoolPairInformationContainer = () => {
  const router = useRouter();
  const [pool, setPool] = useState<PoolDetailModel | null>(null);
  const [loading, setLoading] = useState(true);
  const { gnot, wugnotPath } = useGnotToGnot();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);
  const { fetchPoolDatils } = usePoolData();


  const feeStr = useMemo(() => {
    if (!pool?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(pool.fee)].rateStr;
  }, [pool?.fee]);

  const onClickPath = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    fetchPoolDatils(poolPath).then((e) => {
      if (e) {
        const poolMap = {
          ...e,
          tokenA: {
            ...e.tokenA,
            path: e.tokenA?.path === wugnotPath ? (gnot?.path || "") : (e.tokenA?.path || ""),
            name: e.tokenA?.path === wugnotPath ? (gnot?.name || "") : (e.tokenA?.name || ""),
            symbol: e.tokenA?.path === wugnotPath ? (gnot?.symbol || "") : (e.tokenA?.symbol || ""),
            logoURI: e.tokenA?.path === wugnotPath ? (gnot?.logoURI || "") : (e.tokenA?.logoURI || ""),
          },
          tokenB: {
            ...e.tokenB,
            path: e.tokenB?.path === wugnotPath ? (gnot?.path || "") : (e.tokenB?.path || ""),
            name: e.tokenB?.path === wugnotPath ? (gnot?.name || "") : (e.tokenB?.name || ""),
            symbol: e.tokenB?.path === wugnotPath ? (gnot?.symbol || "") : (e.tokenB?.symbol || ""),
            logoURI: e.tokenB?.path === wugnotPath ? (gnot?.logoURI || "") : (e.tokenB?.logoURI || ""),
          },
        };
        setPool(poolMap);
      } else {
        setPool(e);
      }
    });
  }, [router.query, gnot]);
  
  return pool && (
    <PoolPairInformation
      pool={pool}
      menu={menu}
      onClickPath={onClickPath}
      feeStr={feeStr}
      loading={loading}
    />
  );
};

export default PoolPairInformationContainer;
