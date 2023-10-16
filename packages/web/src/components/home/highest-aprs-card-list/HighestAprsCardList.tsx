import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import { HighestAprsCardListwrapper } from "./HighestAprsCardList.styles";
import IconDiamond from "@components/common/icons/IconDiamond";
import { DEVICE_TYPE } from "@styles/media";
import { CardListPoolInfo } from "@models/common/card-list-item-info";

interface HighestAprsCardListProps {
  list: Array<CardListPoolInfo>;
  device: DEVICE_TYPE;
  onClickItem: (path: string) => void;
}

const HighestAprsCardList: React.FC<HighestAprsCardListProps> = ({
  list,
  device,
  onClickItem,
}) => {
  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);

  return visible ? (
    <HighestAprsCardListwrapper>
      <h2>
        <IconDiamond className="icon-diamond" /> Highest APRs
      </h2>
      <CardList list={list} onClickItem={onClickItem} />
    </HighestAprsCardListwrapper>
  ) : null;
};

export default HighestAprsCardList;
