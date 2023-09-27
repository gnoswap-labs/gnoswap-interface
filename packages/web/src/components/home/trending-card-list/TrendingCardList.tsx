import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import { TrendingCardListwrapper } from "./TrendingCardList.styles";
import IconFlame from "@components/common/icons/IconFlame";
import { DEVICE_TYPE } from "@styles/media";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
interface TrendingCardListProps {
  list: Array<CardListTokenInfo>;
  device: DEVICE_TYPE;
  onClickItem: (path: string) => void;
}

const TrendingCardList: React.FC<TrendingCardListProps> = ({
  list,
  device,
  onClickItem,
}) => {
  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);

  return visible ? (
    <TrendingCardListwrapper>
      <h2>
        <IconFlame className="icon-flame" />
        Trending
      </h2>
      <CardList list={list} onClickItem={onClickItem} />
    </TrendingCardListwrapper>
  ) : null;
};

export default TrendingCardList;
