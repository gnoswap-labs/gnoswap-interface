import React, { useEffect, useState } from "react";
import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";

const WalletPositionCardListContainer: React.FC = () => {
  const [width, setWidth] = useState(Number);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);
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
  return (
    <MyPositionCardList
      list={[]}
      loadMore={false}
      isFetched={true}
      windowSize={width}
      currentIndex={currentIndex}
    />
  );
};

export default WalletPositionCardListContainer;
