/* eslint-disable */
import React, { useEffect, useState } from "react";
import IncentivizedPoolCardList from "@components/earn/incentivized-pool-card-list/IncentivizedPoolCardList";
import { ValuesType } from "utility-types";
import { poolDummy } from "@components/earn/incentivized-pool-card/incentivized-pool-dummy";
import { useRouter } from "next/router";
export interface PoolListProps {
  logo: string[];
  name: string[];
  fee: string;
  liquidity: string;
  apr: string;
  volume24h: string;
  fees24h: string;
}

export const POOL_CONTENT_TITLE = {
  LIQUIDITY: "Liquidity",
  APR: "APR",
  VOLUME: "Trading Volume (24h)",
  FEE: "Fees (24h)",
} as const;

export type POOL_CONTENT_TITLE = ValuesType<typeof POOL_CONTENT_TITLE>;

const IncentivizedPoolCardListContainer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [width, setWidth] = useState(Number);
  const [mobile, setMobile] = useState(false);

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

  const routeItem = (id: number) => {
    router.push(`/earn/pool/${id}`);
  };

  return (
    <IncentivizedPoolCardList
      list={poolDummy}
      isFetched={true}
      loadMore={true}
      onClickLoadMore={() => {}}
      currentIndex={currentIndex}
      routeItem={routeItem}
      mobile={mobile}
    />
  );
};

export default IncentivizedPoolCardListContainer;
