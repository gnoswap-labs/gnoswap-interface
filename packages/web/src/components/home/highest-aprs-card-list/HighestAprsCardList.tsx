import React from "react";
import CardList, { type ListProps } from "@components/home/card-list/CardList";
import { wrapper } from "./HighestAprsCardList.styles";

interface HighestAprsCardListProps {
  list: Array<ListProps>;
}

const HighestAprsCardList: React.FC<HighestAprsCardListProps> = ({ list }) => {
  return (
    <div css={wrapper}>
      <h2>Highest APRs</h2>
      <CardList list={list} />
    </div>
  );
};

export default HighestAprsCardList;
