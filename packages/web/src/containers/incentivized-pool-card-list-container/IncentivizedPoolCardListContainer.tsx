/* eslint-disable */
import React, { useEffect, useState } from "react";
import IncentivizedPoolCardList from "@components/earn/incentivized-pool-card-list/IncentivizedPoolCardList";
import { ValuesType } from "utility-types";
import { poolDummy } from "@components/earn/incentivized-pool-card/incentivized-pool-dummy";
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
  const [width, setWidth] = useState(Number);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <IncentivizedPoolCardList
      list={poolDummy}
      isFetched={true}
      loadMore={true}
      onClickLoadMore={() => {}}
      windowSize={width}
      currentIndex={currentIndex}
    />
  );
};

export default IncentivizedPoolCardListContainer;
