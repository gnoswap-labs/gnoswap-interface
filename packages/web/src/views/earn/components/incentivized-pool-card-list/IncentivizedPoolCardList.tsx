import React, { useMemo } from "react";

import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { IncentivizePoolCardInfo } from "@models/pool/info/pool-card-info";

import IncentivizedPoolCard from "./incentivized-pool-card/IncentivizedPoolCard";

import {
  BlankIncentivizedCard,
  IncentivizedWrapper,
  PoolListWrapper
} from "./IncentivizedPoolCardList.styles";

export interface IncentivizedPoolCardListProps {
  incentivizedPools: IncentivizePoolCardInfo[];
  loadMore: boolean;
  isPoolFetched: boolean;
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
  checkStakedPool: (poolPath: string | null) => boolean;
}

const IncentivizedPoolCardList: React.FC<IncentivizedPoolCardListProps> = ({
  incentivizedPools,
  isPoolFetched,
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
  checkStakedPool,
}) => {
  const data = useMemo(() => {
    if (page === 1) {
      if (width > 1180) {
        return incentivizedPools.slice(0, 8);
      } else {
        return incentivizedPools;
      }
    } else {
      return incentivizedPools;
    }
  }, [page, incentivizedPools, width]);

  const renderPoolList = () => {
    const hasData = !isLoading && incentivizedPools.length > 0;
    const showLoading = !isPoolFetched || isLoading;
    const showBlank =
      isPoolFetched &&
      !isLoading &&
      incentivizedPools.length > 0 &&
      incentivizedPools.length < 4;

    return (
      <PoolListWrapper ref={divRef} onScroll={onScroll} $loading={isLoading}>
        {hasData &&
          data.map((info, index) => (
            <IncentivizedPoolCard
              pool={info}
              key={index}
              routeItem={routeItem}
              themeKey={themeKey}
              checkStakedPool={checkStakedPool}
            />
          ))}
        {showBlank &&
          Array(
            (width <= 1180 && width >= 920 ? 3 : 4) - incentivizedPools.length,
          )
            .fill(1)
            .map((_, index) => <BlankIncentivizedCard key={index} />)}
        {showLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="card-skeleton"
              css={pulseSkeletonStyle({ w: "100%", h: "100%", tone: "600" })}
            />
          ))}
      </PoolListWrapper>
    );
  };

  const renderLoadMore = () => {
    return (
      <>
        {!mobile &&
          !isLoading &&
          incentivizedPools.length > 8 &&
          onClickLoadMore && (
            <LoadMoreButton show={page === 1} onClick={onClickLoadMore} />
          )}
        {showPagination &&
          isPoolFetched &&
          incentivizedPools.length > 0 &&
          !isLoading && (
            <div className="box-indicator">
              <span className="current-page">{currentIndex}</span>
              <span>/</span>
              <span>{incentivizedPools.length}</span>
            </div>
          )}
      </>
    );
  };

  return (
    <IncentivizedWrapper>
      {renderPoolList()}
      {renderLoadMore()}
    </IncentivizedWrapper>
  );
};

export default IncentivizedPoolCardList;
