import React from "react";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import MyPositionCard from "@components/common/my-position-card/MyPositionCard";
import { SHAPE_TYPES, skeletonStyle } from "@constants/skeleton.constant";
import { BlankPositionCard, CardListWrapper, GridWrapper } from "./MyPositionCardList.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface MyPositionCardListProps {
  loadMore: boolean;
  isFetched: boolean;
  onClickLoadMore?: () => void;
  positions: PoolPositionModel[];
  currentIndex: number;
  movePoolDetail: (id: string) => void;
  mobile: boolean;
  divRef?: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
  showPagination: boolean;
  showLoadMore: boolean;
  width: number;
}

const MyPositionCardList: React.FC<MyPositionCardListProps> = ({
  loadMore,
  isFetched,
  onClickLoadMore,
  positions,
  currentIndex,
  movePoolDetail,
  mobile,
  divRef,
  onScroll,
  showPagination,
  width,
}) => (
  <CardListWrapper>
    <GridWrapper ref={divRef} onScroll={onScroll}>
      {isFetched &&
        positions.length > 0 &&
        positions.map((position, idx) => (
          <MyPositionCard currentIndex={idx} position={position} key={idx} movePoolDetail={movePoolDetail} mobile={mobile} />
        ))}
      {isFetched &&
        positions.length > 0 && positions.length < 4 &&
        (Array((width <= 1180 && width >= 1000 ? 3 : 4) - positions.length).fill(1)).map((_, index) => (
          <BlankPositionCard key={index} />
        ))
      }
      {!isFetched &&
        Array.from({ length: 4 }).map((_, idx) => (
          <span
            key={idx}
            className="card-skeleton"
            css={skeletonStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
          />
        ))}
    </GridWrapper>
    {(!mobile && onClickLoadMore && (
      <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />
    )
    )}
    {(showPagination &&
      <div className="box-indicator">
        <span className="current-page">{currentIndex}</span>
        <span>/</span>
        <span>{positions.length}</span>
      </div>
    )}
  </CardListWrapper>
);

export default MyPositionCardList;
