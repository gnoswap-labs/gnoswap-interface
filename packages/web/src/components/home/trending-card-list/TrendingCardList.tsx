import React from "react";
import CardList, { type ListProps } from "@components/home/card-list/CardList";
import { wrapper } from "./TrendingCardList.styles";
import IconFlame from "@components/common/icons/IconFlame";
interface TrendingCardListProps {
  list: Array<ListProps>;
}

const TrendingCardList: React.FC<TrendingCardListProps> = ({ list }) => {
  return (
    <div css={wrapper}>
      <h2>
        <IconFlame className="icon-flame" />
        Trending
      </h2>
      <CardList list={list} />
    </div>
  );
};

export default TrendingCardList;
