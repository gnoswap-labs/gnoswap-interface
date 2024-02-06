import React, { useCallback, useEffect, useState } from "react";
import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import { useRouter } from "next/router";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";

const WalletPositionCardListContainer: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const { width } = useWindowSize();
  const {  isFetchedPosition, loading : loadingPosition, positions } = usePositionData();
  const { loading } = usePoolData();
  const themeKey = useAtomValue(ThemeState.themeKey);

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 920 ? setMobile(true) : setMobile(false);
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
      positions={positions}
      loadMore={false}
      isFetched={isFetchedPosition}
      isLoading={loading || loadingPosition}
      movePoolDetail={movePoolDetail}
      currentIndex={currentIndex}
      mobile={mobile}
      width={width}
      showPagination={false}
      showLoadMore={false}
      themeKey={themeKey}
    />
  );
};

export default WalletPositionCardListContainer;
