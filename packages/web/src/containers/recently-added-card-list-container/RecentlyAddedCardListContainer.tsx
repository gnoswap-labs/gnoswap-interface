import { recentlyList } from "@components/home/card-list/card-list-dummy";
import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import React, { useEffect, useState } from "react";

const RecentlyAddedCardListContainer: React.FC = () => {
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
  return <RecentlyAddedCardList list={recentlyList} windowSize={width} />;
};

export default RecentlyAddedCardListContainer;
