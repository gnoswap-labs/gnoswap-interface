import React, { useCallback, useEffect, useState } from "react";
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

  const movePoolDetail = useCallback((id: string) => {
    router.push(`/earn/pool/${id}`);
  }, [router]);

  return (
    <MyPositionCardList
      positions={[]}
      loadMore={false}
      isFetched={true}
      movePoolDetail={movePoolDetail}
      currentIndex={currentIndex}
      mobile={mobile}
    />
  );
};

export default WalletPositionCardListContainer;
