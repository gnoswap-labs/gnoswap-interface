import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/use-token-data";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const RecentlyAddedCardListContainer: React.FC = () => {
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const { recentlyAddedTokens } = useTokenData();

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
    />
  );
};

export default RecentlyAddedCardListContainer;
