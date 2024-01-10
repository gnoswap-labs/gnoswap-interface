import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useTokenData } from "@hooks/token/use-token-data";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const RecentlyAddedCardListContainer: React.FC = () => {
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const { recentlyAddedTokens, loading } = useTokenData();
  const { loading: isLoadingPoolData } = usePoolData();
  const { isLoadingCommon } = useLoading();

  const moveTokenDetails = useCallback((path: string) => {
    router.push("/tokens/" + path);
  }, [router]);

  const onClickItem = useCallback((path: string) => {
    moveTokenDetails(path);
  }, [moveTokenDetails]);

  return (
    <RecentlyAddedCardList
      list={recentlyAddedTokens}
      device={breakpoint}
      onClickItem={onClickItem}
      loading={loading || isLoadingPoolData || isLoadingCommon}
    />
  );
};

export default RecentlyAddedCardListContainer;
