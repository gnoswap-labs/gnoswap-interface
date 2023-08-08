import React from "react";
import CardList, { type ListProps } from "@components/home/card-list/CardList";
import { HighestAprsCardListwrapper } from "./HighestAprsCardList.styles";
import IconDiamond from "@components/common/icons/IconDiamond";
import { DeviceSize } from "@styles/media";

interface HighestAprsCardListProps {
  list: Array<ListProps>;
  windowSize: number;
}

const HighestAprsCardList: React.FC<HighestAprsCardListProps> = ({
  list,
  windowSize,
}) => {
  return windowSize > DeviceSize.mobile ? (
    <HighestAprsCardListwrapper>
      <h2>
        <IconDiamond className="icon-diamond" /> Highest APRs
      </h2>
      <CardList list={list} />
    </HighestAprsCardListwrapper>
  ) : null;
};

export default HighestAprsCardList;
