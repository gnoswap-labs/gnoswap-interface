import React, { useEffect, useState } from "react";
import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import { useRouter } from "next/router";

const WalletPositionCardListContainer: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 1000 ? setMobile(true) : setMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const routeItem = (id: number) => {
    router.push(`/earn/pool/${id}`);
  };
  return (
    <MyPositionCardList
      list={[]}
      loadMore={false}
      isFetched={true}
      routeItem={routeItem}
      currentIndex={currentIndex}
      mobile={mobile}
    />
  );
};

export default WalletPositionCardListContainer;
