import { trendingList } from "@components/home/card-list/card-list-dummy";
import TrendingCardList from "@components/home/trending-card-list/TrendingCardList";
import React from "react";

const TrendingCardListContainer: React.FC = () => {
  return <TrendingCardList list={trendingList} />;
};

export default TrendingCardListContainer;
