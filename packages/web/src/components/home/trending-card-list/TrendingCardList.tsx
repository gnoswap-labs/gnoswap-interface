import React from "react";
import CardList, { type ListProps } from "@components/home/card-list/CardList";
import { TrendingCardListwrapper } from "./TrendingCardList.styles";
import IconFlame from "@components/common/icons/IconFlame";
import { DeviceSize } from "@styles/media";
interface TrendingCardListProps {
  list: Array<ListProps>;
  windowSize: number;
}

const TrendingCardList: React.FC<TrendingCardListProps> = ({
  list,
  windowSize,
}) => {
  return windowSize > DeviceSize.mobile ? (
    <TrendingCardListwrapper>
      <h2>
        <IconFlame className="icon-flame" />
        Trending
      </h2>
      <CardList list={list} />
    </TrendingCardListwrapper>
  ) : null;
};

export default TrendingCardList;
