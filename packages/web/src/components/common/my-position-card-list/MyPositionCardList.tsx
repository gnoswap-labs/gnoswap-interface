import React from "react";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import MyPositionCard from "@components/common/my-position-card/MyPositionCard";
import { wrapper } from "./MyPositionCardList.styles";
import { SHAPE_TYPES, skeletonStyle } from "@constants/skeleton.constant";

interface MyPositionCardListProps {
  loadMore?: boolean;
  isFetched: boolean;
  onClickLoadMore?: () => void;
  list: any[];
}

const MyPositionCardList: React.FC<MyPositionCardListProps> = ({
  loadMore,
  isFetched,
  onClickLoadMore,
  list,
}) => (
  <>
    <div css={wrapper}>
      {isFetched &&
        list.length > 0 &&
        list.map((item, idx) => <MyPositionCard item={item} key={idx} />)}
      {!isFetched &&
        Array.from({ length: 4 }).map((_, idx) => (
          <span
            key={idx}
            className="card-skeleton"
            css={skeletonStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
          />
        ))}
    </div>
    {loadMore && onClickLoadMore && (
      <div className="load-more">
        <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />
      </div>
    )}
  </>
);

export default MyPositionCardList;
