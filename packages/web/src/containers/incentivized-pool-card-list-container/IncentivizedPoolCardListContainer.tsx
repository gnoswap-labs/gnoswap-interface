/* eslint-disable */
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import IncentivizedPoolCardList from "@components/earn/incentivized-pool-card-list/IncentivizedPoolCardList";
import { ValuesType } from "utility-types";
import { useRouter } from "next/router";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useLoading } from "@hooks/common/use-loading";
import { usePositionData } from "@hooks/common/use-position-data";
export interface PoolListProps {
  logo: string[];
  name: string[];
  fee: string;
  liquidity: string;
  apr: string;
  volume24h: string;
  fees24h: string;
  currentTick: string;
}

export const POOL_CONTENT_TITLE = {
  TVL: "TVL",
  LIQUIDITY: "Liquidity",
  APR: "APR",
  VOLUME: "Trading Volume (24h)",
  FEE: "Fees (24h)",
} as const;

export type POOL_CONTENT_TITLE = ValuesType<typeof POOL_CONTENT_TITLE>;

const IncentivizedPoolCardListContainer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const { incentivizedPools, isFetchedPools, updatePools, loading } = usePoolData();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { width } = useWindowSize();
  const { isLoadingCommon } = useLoading();
  const { loading: loadingPosition, isStakedPool } = usePositionData();
  
  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 920 ? setMobile(true) : setMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    updatePools();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loadMore = useMemo(() => {
    return incentivizedPools.length > page * 8;
  }, [incentivizedPools.length, page]);

  const routeItem = (id: string) => {
    router.push(`/earn/pool/${id}`);
  };

  const handleClickLoadMore = useCallback(() => {
    if (page === 1) {
      setPage(prev => prev + 1);
    } else {
      setPage(1);
    }
  }, [page]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(Math.min(Math.floor(currentScrollX / 332) + 1, incentivizedPools.length));
    }
  };

  const showPagination = useMemo(() => {
    if (width >= 920) {
      return false;
    } else {
      return true;
    }
  }, [incentivizedPools, width]);

  return (
    <IncentivizedPoolCardList
      incentivizedPools={incentivizedPools}
      isFetched={isFetchedPools}
      loadMore={!!loadMore}
      onClickLoadMore={handleClickLoadMore}
      currentIndex={currentIndex}
      routeItem={routeItem}
      mobile={mobile}
      page={page}
      themeKey={themeKey}
      divRef={divRef}
      onScroll={handleScroll}
      showPagination={showPagination}
      width={width}
      isLoading={isLoadingCommon || loading || loadingPosition}
      isStakedPool={isStakedPool}
    />
  );
};

export default IncentivizedPoolCardListContainer;
