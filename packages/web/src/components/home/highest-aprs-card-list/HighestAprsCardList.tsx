import React from "react";
import CardList, { type ListProps } from "@components/home/card-list/CardList";
import { wrapper } from "./HighestAprsCardList.styles";
import IconDiamond from "@components/common/icons/IconDiamond";

interface HighestAprsCardListProps {
  list: Array<ListProps>;
}

const HighestAprsCardList: React.FC<HighestAprsCardListProps> = ({ list }) => {
  return (
    <div css={wrapper}>
      <h2>
        <IconDiamond className="icon-diamond" /> Highest APRs
      </h2>
      <CardList list={list} />
    </div>
  );
};

export default HighestAprsCardList;
