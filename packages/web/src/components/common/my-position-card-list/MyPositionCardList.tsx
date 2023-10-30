import React from "react";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import MyPositionCard from "@components/common/my-position-card/MyPositionCard";
import { SHAPE_TYPES, skeletonStyle } from "@constants/skeleton.constant";
import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { CardListWrapper, GridWrapper } from "./MyPositionCardList.styles";

interface MyPositionCardListProps {
  loadMore?: boolean;
  isFetched: boolean;
  onClickLoadMore?: () => void;
  positions: PoolPosition[];
  currentIndex: number;
  movePoolDetail: (id: string) => void;
  mobile: boolean;
}

const MyPositionCardList: React.FC<MyPositionCardListProps> = ({
  loadMore,
  isFetched,
  onClickLoadMore,
  positions,
  currentIndex,
  movePoolDetail,
  mobile,
}) => (
  <CardListWrapper>
    <GridWrapper>
      {isFetched &&
        positions.length > 0 &&
        positions.map((item, idx) => (
          <MyPositionCard item={item} key={idx} movePoolDetail={movePoolDetail} />
        ))}
      {!isFetched &&
        Array.from({ length: 4 }).map((_, idx) => (
          <span
            key={idx}
            className="card-skeleton"
            css={skeletonStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
          />
        ))}
    </GridWrapper>
    {!mobile && (
      loadMore &&
      onClickLoadMore && (
        <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />
      )
    )} 
    {(positions.length !== 0 && mobile &&
      <div className="box-indicator">
        <span className="current-page">{currentIndex}</span>
        <span>/</span>
        <span>{positions.length}</span>
      </div>
    )}
  </CardListWrapper>
);

export default MyPositionCardList;
