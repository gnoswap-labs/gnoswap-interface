import React from "react";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import MyPositionCard from "@components/common/my-position-card/MyPositionCard";
import { wrapper } from "./MyPositionCardList.styles";

interface MyPositionCardListProps {
  loadMore?: boolean;
  onClickLoadMore?: () => void;
  list: any[];
}

const MyPositionCardList: React.FC<MyPositionCardListProps> = ({
  loadMore,
  onClickLoadMore,
  list,
}) => (
  <>
    <div css={wrapper}>
      {list.map((item, idx) => (
        <MyPositionCard item={item} key={idx} />
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
