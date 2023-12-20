import React, { useCallback, useEffect, useState } from "react";
import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import { useRouter } from "next/router";
import { useWindowSize } from "@hooks/common/use-window-size";

const WalletPositionCardListContainer: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const { width } = useWindowSize();

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth <= 1180 ? setMobile(true) : setMobile(false);
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
      width={width}
      showPagination={false}
      showLoadMore={false}
      themeKey="dark"
    />
  );
};

export default WalletPositionCardListContainer;
