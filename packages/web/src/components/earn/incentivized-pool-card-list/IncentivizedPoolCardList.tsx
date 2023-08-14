import React from "react";
import {
  IncentivizedWrapper,
  PoolListWrapper,
} from "./IncentivizedPoolCardList.styles";
import { type PoolListProps } from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import IncentivizedPoolCard from "@components/earn/incentivized-pool-card/IncentivizedPoolCard";
import { SHAPE_TYPES, skeletonStyle } from "@constants/skeleton.constant";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { DeviceSize } from "@styles/media";
interface IncentivizedPoolCardListProps {
  list: Array<PoolListProps>;
  loadMore?: boolean;
  isFetched: boolean;
  onClickLoadMore?: () => void;
  windowSize: number;
  currentIndex: number;
}

const IncentivizedPoolCardList: React.FC<IncentivizedPoolCardListProps> = ({
  list,
  loadMore,
  isFetched,
  onClickLoadMore,
  windowSize,
  currentIndex,
}) => (
  <IncentivizedWrapper>
    <PoolListWrapper>
      {isFetched &&
        list.length > 0 &&
        list.map((item, idx) => <IncentivizedPoolCard item={item} key={idx} />)}
      {!isFetched &&
        Array.from({ length: 8 }).map((_, idx) => (
          <span
            key={idx}
            className="card-skeleton"
            css={skeletonStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
          />
        ))}
    </PoolListWrapper>
    {windowSize > DeviceSize.mobile ? (
      loadMore &&
      onClickLoadMore && (
        <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />
      )
    ) : (
      <div className="box-indicator">
        <span className="current-page">{currentIndex}</span>
        <span>/</span>
        <span>{list.length}</span>
      </div>
    )}
  </IncentivizedWrapper>
);

export default IncentivizedPoolCardList;
