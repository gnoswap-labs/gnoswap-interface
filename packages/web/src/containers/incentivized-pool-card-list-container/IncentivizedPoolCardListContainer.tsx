/* eslint-disable */
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import IncentivizedPoolCardList from "@components/earn/incentivized-pool-card-list/IncentivizedPoolCardList";
import { ValuesType } from "utility-types";
import { useRouter } from "next/router";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
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
  const { incentivizedPools, isFetchedPools } = usePoolData();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 1000 ? setMobile(true) : setMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
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
    if (loadMore) {
      setPage(prev => prev + 1);
    } else {
      setPage(1);
    }
  }, [loadMore]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(Math.floor(currentScrollX / 290) + 1);
    }
  };

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
    />
  );
};

export default IncentivizedPoolCardListContainer;
