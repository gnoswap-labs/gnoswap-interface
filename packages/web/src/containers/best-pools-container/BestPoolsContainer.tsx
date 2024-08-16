import React, { useMemo } from "react";
import BestPools from "@components/token/best-pools/BestPools";
import { SwapFeeTierType } from "@constants/option.constant";
import { type TokenPairInfo } from "@models/token/token-pair-info";
import {
  useGetToken,
  useGetTokens,
  useGetChainInfo,
  useGetTokenDetails,
} from "@query/token";
import { IBestPoolResponse } from "@repositories/token";
import { useGetPoolList } from "src/react-query/pools";
import { PoolModel } from "@models/pool/pool-model";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useLoading } from "@hooks/common/use-loading";
import { formatOtherPrice } from "@utils/new-number-utils";
import useCustomRouter from "@hooks/common/use-custom-router";

export interface BestPool {
  tokenPair: TokenPairInfo;
  feeRate: SwapFeeTierType;
  tvl: string;
  apr: string;
  id: string;
  poolPath: string;
}

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
