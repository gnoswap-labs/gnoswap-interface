import { css } from "@emotion/react";
import React from "react";
import CardList from "@components/home/card-list/CardList";

interface RecentlyAddedCardListProps {}

const RecentlyAddedCardList: React.FC<RecentlyAddedCardListProps> = () => {
  return (
    <div
      css={css`
        border: 1px solid orange;
      `}
    >
      <h2>Recently Added</h2>
      <CardList />
    </div>
  );
};

export default RecentlyAddedCardList;
