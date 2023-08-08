import { highestList } from "@components/home/card-list/card-list-dummy";
import HighestAprsCardList from "@components/home/highest-aprs-card-list/HighestAprsCardList";
import React, { useEffect, useState } from "react";

const HighestAprsCardListContainer: React.FC = () => {
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
  return <HighestAprsCardList list={highestList} windowSize={width} />;
};

export default HighestAprsCardListContainer;
