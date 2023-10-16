/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import IncentivizedPoolCardList from "@components/earn/incentivized-pool-card-list/IncentivizedPoolCardList";
import { ValuesType } from "utility-types";
import { useRouter } from "next/router";
import { usePoolData } from "@hooks/pool/use-pool-data";
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
  const [currentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const { incentivizedPools, isFetchedPools } = usePoolData();

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

  return (
    <IncentivizedPoolCardList
      incentivizedPools={incentivizedPools}
      isFetched={isFetchedPools}
      loadMore={loadMore}
      onClickLoadMore={() => { }}
      currentIndex={currentIndex}
      routeItem={routeItem}
      mobile={mobile}
    />
  );
};

export default IncentivizedPoolCardListContainer;
