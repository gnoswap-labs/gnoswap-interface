import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { CardListKeyStats } from "@models/common/card-list-item-info";
import { useGetDashboardTVL, useGetDashboardVolume } from "@query/dashboard";
import { useGetChainList } from "@query/token";
import useCustomRouter from "@hooks/common/use-custom-router";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { formatOtherPrice } from "@utils/new-number-utils";

const RecentlyAddedCardListContainer: React.FC = () => {
  const router = useCustomRouter();
  const { breakpoint } = useWindowSize();
  const { isLoadingDashboardStats } = useLoading();
  const { data: tvlData } = useGetDashboardTVL();
  const { data } = useGetDashboardVolume();
  const { data: chainData } = useGetChainList();
  const { t } = useTranslation();

  const { fees24hUsd } = data || {};

  const list: CardListKeyStats[] = [
    {
      label: t("Main:keyStatCard.totalValueLocked"),
      content: formatOtherPrice(tvlData?.latest),
    },
    {
      label: t("Main:keyStatCard.swapVol24"),
      content: formatOtherPrice(chainData?.stat?.volume24hUsd),
    },
    {
      label: t("Main:keyStatCard.swapFee24"),
      content: formatOtherPrice(fees24hUsd),
    },
  ];

  const moveTokenDetails = useCallback(
    (path: string) => {
      router.movePageWithTokenPath("TOKEN", path);
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
      loading={isLoadingDashboardStats}
    />
  );
};

export default RecentlyAddedCardListContainer;
