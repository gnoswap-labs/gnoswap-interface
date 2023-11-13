import React from "react";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import MyPositionCard from "@components/common/my-position-card/MyPositionCard";
import { SHAPE_TYPES, skeletonStyle } from "@constants/skeleton.constant";
import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { BlankPositionCard, CardListWrapper, GridWrapper } from "./MyPositionCardList.styles";

interface MyPositionCardListProps {
  loadMore?: boolean;
  isFetched: boolean;
  onClickLoadMore?: () => void;
  positions: PoolPosition[];
  currentIndex: number;
  movePoolDetail: (id: string) => void;
  mobile: boolean;
  divRef?: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
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
}) => (
  <CardListWrapper>
    <GridWrapper ref={divRef} onScroll={onScroll}>
      {isFetched &&
        positions.length > 0 &&
        positions.map((item, idx) => (
          <MyPositionCard currentIndex={idx} item={item} key={idx} movePoolDetail={movePoolDetail} mobile={mobile}/>
        ))}
      {isFetched &&
        positions.length > 0 && positions.length < 4 &&
        (Array(4 - positions.length).fill(1)).map((_, index) => (
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
