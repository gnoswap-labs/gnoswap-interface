import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useTokenData } from "@hooks/token/use-token-data";
import { CardListKeyStats } from "@models/common/card-list-item-info";
import { useGetChainList } from "@query/token";
import { TvlResponse } from "@repositories/dashboard";
import { IVolumeResponse } from "@repositories/dashboard/response/volume-response";
import { useQuery } from "@tanstack/react-query";
import { makeId } from "@utils/common";
import { toUnitFormat } from "@utils/number-utils";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const RecentlyAddedCardListContainer: React.FC = () => {
  const { dashboardRepository } = useGnoswapContext();
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const { loading, isLoadingTokenPrice } = useTokenData();
  const { loading: isLoadingPoolData } = usePoolData();
  const { isLoadingCommon } = useLoading();
  const { data: tvlData } = useQuery<TvlResponse, Error>({
    queryKey: ["dashboardTvl"],
    queryFn: dashboardRepository.getDashboardTvl,
  });

  const { data, isLoading: isLoadingVolume } = useQuery<IVolumeResponse, Error>({
    queryKey: ["volumePriceInfo"],
    queryFn: dashboardRepository.getDashboardVolume,
    refetchInterval: 60 * 1000,
  });
  const { data: chainData, isLoading: isLoadingChain } = useGetChainList();

  const { fees24hUsd } = data || {};

  const list: CardListKeyStats[] = [
    {
      label: "Total Value Locked",
      content: toUnitFormat(tvlData?.latest || "0", true, true),
    },
    {
      label: "Swap Volume 24h",
      content: toUnitFormat(Number(chainData?.stat?.volume24hUsd ?? 0), true, true),
    },
    {
      label: "Swap Fees 24h",
      content: `$${fees24hUsd || "0"}`,
    },
  ];

  const moveTokenDetails = useCallback(
    (path: string) => {
      router.push("/tokens/" + makeId(path));
    },
    [router],
  );

  const onClickItem = useCallback(
    (path: string) => {
      moveTokenDetails(path);
    },
    [moveTokenDetails],
  );

  return (
    <RecentlyAddedCardList
      list={list}
      device={breakpoint}
      onClickItem={onClickItem}
      loading={loading || isLoadingPoolData || isLoadingCommon || isLoadingTokenPrice || isLoadingVolume || isLoadingChain}
    />
  );
};

export default RecentlyAddedCardListContainer;
