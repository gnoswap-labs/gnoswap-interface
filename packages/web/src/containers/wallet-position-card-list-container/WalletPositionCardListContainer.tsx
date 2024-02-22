import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import { useRouter } from "next/router";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import { useWallet } from "@hooks/wallet/use-wallet";

const WalletPositionCardListContainer: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(1);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const { width } = useWindowSize();
  const {  isFetchedPosition, loading : loadingPosition, positions } = usePositionData();
  const { loading } = usePoolData();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { connected } = useWallet();

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

  const showPagination = useMemo(() => {
    if (width >= 920) {
      return false;
    } else {
      return true;
    }
  }, [positions, width]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(Math.min(Math.floor(currentScrollX / 322) + 1, positions.length));
    }
  };

  const sortedData = positions.sort((x,y) => Number(y.positionUsdValue) - Number(x.positionUsdValue));
  if (!connected) return null;

  return (
    <MyPositionCardList
      positions={sortedData}
      loadMore={false}
      isFetched={isFetchedPosition}
      isLoading={loading || loadingPosition}
      movePoolDetail={movePoolDetail}
      currentIndex={currentIndex}
      mobile={mobile}
      width={width}
      showPagination={showPagination}
      showLoadMore={true}
      themeKey={themeKey}
      divRef={divRef}
      onScroll={handleScroll}
    />
  );
};

export default WalletPositionCardListContainer;
