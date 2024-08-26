import React, { useMemo } from "react";

import { SwapFeeTierType } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolModel } from "@models/pool/pool-model";
import { useGetPoolList } from "@query/pools";
import {
  useGetChainInfo,
  useGetToken,
  useGetTokenDetails,
  useGetTokens
} from "@query/token";
import { IBestPoolResponse } from "@repositories/token";
import { formatOtherPrice } from "@utils/new-number-utils";

import { BestPool } from "../../components/best-pools/best-pool-card-list/BestPoolCardList";
import BestPools from "../../components/best-pools/BestPools";

const BestPoolsContainer: React.FC = () => {
  const { wugnotPath, getGnotPath } = useGnotToGnot();
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const { data: { bestPools = [] } = {}, isLoading } = useGetTokenDetails(
    path === "gnot" ? wugnotPath : path,
    { enabled: !!path },
  );
  const { data: pools = [], isLoading: isLoadingGetPoolList } =
    useGetPoolList();
  const { data: tokenB } = useGetToken(path, { enabled: !!path });
  const { isLoading: isLoadingChainList } = useGetChainInfo();
  const { isLoading: isLoadingListToken } = useGetTokens();
  const { isLoading: isLoadingCommon } = useLoading();

  const bestPoolList: BestPool[] = useMemo(() => {
    return (bestPools ?? []).map((item: IBestPoolResponse) => {
      const temp =
        pools.filter(
          (_item: PoolModel) => _item.poolPath === item.poolPath,
        )?.[0] || {};

      return {
        tokenPair: {
          tokenA: {
            path: getGnotPath(item.tokenA).path,
            name: getGnotPath(item.tokenA).name,
            symbol: getGnotPath(item.tokenA).symbol,
            logoURI: getGnotPath(item.tokenA).logoURI,
          },
          tokenB: {
            path: getGnotPath(item.tokenB).path,
            name: getGnotPath(item.tokenB).name,
            symbol: getGnotPath(item.tokenB).symbol,
            logoURI: getGnotPath(item.tokenB).logoURI,
          },
        },
        poolPath: temp?.poolPath || "",
        id: temp?.id || "",
        feeRate: `FEE_${item.fee || "100"}` as SwapFeeTierType,
        tvl: formatOtherPrice(item.tvlUsd),
        apr: item.apr,
      };
    });
  }, [bestPools, getGnotPath, pools]);

  return (
    <BestPools
      titleSymbol={tokenB?.symbol || ""}
      cardList={bestPoolList}
      loading={
        isLoading ||
        isLoadingGetPoolList ||
        isLoadingChainList ||
        isLoadingListToken ||
        isLoadingCommon
      }
    />
  );
};

export default BestPoolsContainer;
