import { highestList } from "@components/home/card-list/card-list-dummy";
import HighestAprsCardList from "@components/home/highest-aprs-card-list/HighestAprsCardList";
import React from "react";

const HighestAprsCardListContainer: React.FC = () => {
  return <HighestAprsCardList list={highestList} />;
};

export default HighestAprsCardListContainer;
