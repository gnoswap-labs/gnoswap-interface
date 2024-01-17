import React, { useMemo } from "react";
import {
  BlankIncentivizedCard,
  IncentivizedWrapper,
  PoolListWrapper,
} from "./IncentivizedPoolCardList.styles";
import IncentivizedPoolCard from "@components/earn/incentivized-pool-card/IncentivizedPoolCard";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
export interface IncentivizedPoolCardListProps {
  incentivizedPools: PoolCardInfo[];
  loadMore: boolean;
  isFetched: boolean;
  onClickLoadMore?: () => void;
  currentIndex: number;
  routeItem: (id: string) => void;
  mobile: boolean;
  page: number;
  themeKey: "dark" | "light";
  divRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  showPagination: boolean;
  width: number;
  isLoading: boolean;
}

const IncentivizedPoolCardList: React.FC<IncentivizedPoolCardListProps> = ({
  incentivizedPools,
  isFetched,
  onClickLoadMore,
  currentIndex,
  routeItem,
  mobile,
  page,
  themeKey,
  divRef,
  onScroll,
  showPagination,
  width,
  isLoading,
}) => {
  const data = useMemo(() => {
    if (page === 1) {
      if (width > 1180) {
        return incentivizedPools.slice(0, 8);
      } else if (width > 920) {
        return incentivizedPools.slice(0, 6);
      } else {
        return incentivizedPools;
      }
    } else {
      return incentivizedPools;
    }
  }, [page, incentivizedPools, width]);
  return (
    <IncentivizedWrapper>
      <PoolListWrapper ref={divRef} onScroll={onScroll} loading={isLoading}>
        {!isLoading &&
          incentivizedPools.length > 0 &&
          data.map((info, index) => (
            <IncentivizedPoolCard
              pool={info}
              key={index}
              routeItem={routeItem}
              themeKey={themeKey}
            />
          ))}
        {isFetched &&
          !isLoading &&
          incentivizedPools.length > 0 &&
          incentivizedPools.length < 8 &&
          incentivizedPools.length % 4 !== 0 &&
          Array(
            (incentivizedPools.length > 4 && width > 1180
              ? 8
              : width <= 1180 && width >= 920
              ? 3
              : 4) -
              (incentivizedPools.length > 4 && width > 1180
                ? incentivizedPools.length
                : width <= 1180 && width >= 920
                ? incentivizedPools.length % 3
                : incentivizedPools.length % 4),
          )
            .fill(1)
            .map((_, index) => <BlankIncentivizedCard key={index} />)}
        {(!isFetched || isLoading) &&
          Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="card-skeleton"
              css={pulseSkeletonStyle({ w: "100%", h: "100%", tone: "600" })}
            />
          ))}
      </PoolListWrapper>
      {!mobile &&
        !isLoading &&
        incentivizedPools.length > 8 &&
        onClickLoadMore && (
          <LoadMoreButton show={page === 1} onClick={onClickLoadMore} />
        )}
      {showPagination &&
        isFetched &&
        incentivizedPools.length > 0 &&
        !isLoading && (
          <div className="box-indicator">
            <span className="current-page">{currentIndex}</span>
            <span>/</span>
            <span>{incentivizedPools.length}</span>
          </div>
        )}
    </IncentivizedWrapper>
  );
};

export default IncentivizedPoolCardList;
