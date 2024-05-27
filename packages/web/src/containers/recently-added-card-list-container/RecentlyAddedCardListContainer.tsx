import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { CardListKeyStats } from "@models/common/card-list-item-info";
import { useGetDashboardTVL, useGetDashboardVolume } from "@query/dashboard";
import { useGetChainList } from "@query/token";
import { makeId } from "@utils/common";
import { toUnitFormat } from "@utils/number-utils";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const RecentlyAddedCardListContainer: React.FC = () => {
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const { isLoading: isLoadingCommon } = useLoading();
  const { data: tvlData } = useGetDashboardTVL();
  const { data } = useGetDashboardVolume();
  const { data: chainData } = useGetChainList();

  const { fees24hUsd } = data || {};

  const list: CardListKeyStats[] = [
    {
      label: "Total Value Locked",
      content: toUnitFormat(tvlData?.latest || "0", true, true),
    },
    {
      label: "Swap Volume 24h",
      content: toUnitFormat(
        Number(chainData?.stat?.volume24hUsd ?? 0),
        true,
        true,
      ),
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
      loading={isLoadingCommon}
    />
  );
};

export default RecentlyAddedCardListContainer;
