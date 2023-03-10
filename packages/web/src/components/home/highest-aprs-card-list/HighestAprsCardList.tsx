import { css } from "@emotion/react";
import React from "react";
import CardList from "@components/home/card-list/CardList";

interface HighestAprsCardListProps {}

const HighestAprsCardList: React.FC<HighestAprsCardListProps> = () => {
  return (
    <div
      css={css`
        border: 1px solid orange;
      `}
    >
      <h2>Highest APRs</h2>
      <CardList />
    </div>
  );
};

export default HighestAprsCardList;
