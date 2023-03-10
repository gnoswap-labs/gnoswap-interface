import { css } from "@emotion/react";
import React from "react";
import CardList from "@components/home/card-list/CardList";

interface TrendingCardListProps {}

const TrendingCardList: React.FC<TrendingCardListProps> = () => {
  return (
    <div
      css={css`
        border: 1px solid orange;
      `}
    >
      <h2>Trending</h2>
      <CardList />
    </div>
  );
};

export default TrendingCardList;
