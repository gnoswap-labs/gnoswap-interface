import { trendingList } from "@components/home/card-list/card-list-dummy";
import TrendingCardList from "@components/home/trending-card-list/TrendingCardList";
import React, { useEffect, useState } from "react";

const TrendingCardListContainer: React.FC = () => {
  const [width, setWidth] = useState(Number);
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return <TrendingCardList list={trendingList} windowSize={width} />;
};

export default TrendingCardListContainer;
