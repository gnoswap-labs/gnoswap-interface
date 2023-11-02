import React from "react";
import {
  IncentivizedWrapper,
  PoolListWrapper,
} from "./IncentivizedPoolCardList.styles";
import IncentivizedPoolCard from "@components/earn/incentivized-pool-card/IncentivizedPoolCard";
import { SHAPE_TYPES, skeletonStyle } from "@constants/skeleton.constant";
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
}

const IncentivizedPoolCardList: React.FC<IncentivizedPoolCardListProps> = ({
  incentivizedPools,
  loadMore,
  isFetched,
  onClickLoadMore,
  currentIndex,
  routeItem,
  mobile,
  page,
}) => (
  <IncentivizedWrapper>
    <PoolListWrapper>
      {isFetched &&
        incentivizedPools.length > 0 &&
        incentivizedPools.slice(0, page * 8).map((info, index) => (
          <IncentivizedPoolCard pool={info} key={index} routeItem={routeItem} />
        ))}
      {!isFetched &&
        Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="card-skeleton"
            css={skeletonStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
          />
        ))}
    </PoolListWrapper>
    {!mobile ? (
      incentivizedPools.length > 8 &&
      onClickLoadMore && (
        <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />
      )
    ) : (
      <div className="box-indicator">
        <span className="current-page">{currentIndex}</span>
        <span>/</span>
        <span>{incentivizedPools.length}</span>
      </div>
    )}
  </IncentivizedWrapper>
);

export default IncentivizedPoolCardList;
