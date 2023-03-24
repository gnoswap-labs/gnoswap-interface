import { recentlyList } from "@components/home/card-list/card-list-dummy";
import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import React from "react";

const RecentlyAddedCardListContainer: React.FC = () => {
  return <RecentlyAddedCardList list={recentlyList} />;
};

export default RecentlyAddedCardListContainer;
