import TrendingCardList from "@components/home/trending-card-list/TrendingCardList";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/use-token-data";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const TrendingCardListContainer: React.FC = () => {
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const { trendingTokens } = useTokenData();

  const moveTokenDetails = useCallback((path: string) => {
    router.push("/tokens/" + path);
  }, [router]);

  const onClickItem = useCallback((path: string) => {
    moveTokenDetails(path);
  }, [moveTokenDetails]);

  return (
    <TrendingCardList
      list={trendingTokens}
      device={breakpoint}
      onClickItem={onClickItem}
    />
  );
};

export default TrendingCardListContainer;
