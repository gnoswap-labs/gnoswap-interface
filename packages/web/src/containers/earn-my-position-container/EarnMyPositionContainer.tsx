import EarnMyPositions from "@components/earn/earn-my-positions/EarnMyPositions";
import { usePositionData } from "@hooks/common/use-position-data";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useTokenData } from "@hooks/token/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { ValuesType } from "utility-types";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";

export const POSITION_CONTENT_LABEL = {
  VALUE: "Value",
  APR: "APR",
  CURRENT_PRICE: "Current Price",
  MIN_PRICE: "Min Price",
  MAX_PRICE: "Max Price",
  STAR_TAG: "✨",
} as const;

export type POSITION_CONTENT_LABEL = ValuesType<typeof POSITION_CONTENT_LABEL>;

interface EarnMyPositionContainerProps {
  loadMore?: boolean;
}

const EarnMyPositionContainer: React.FC<
  EarnMyPositionContainerProps
> = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [page, setPage] = useState(1);

  const router = useRouter();
  const { connected, connectAdenaClient, isSwitchNetwork, switchNetwork } = useWallet();
  const { updateTokenPrices } = useTokenData();
  const { updatePositions, isFetchedPools, loading } = usePoolData();
  const { width } = useWindowSize();
  const divRef = useRef<HTMLDivElement | null>(null);
  const { openModal } = useConnectWalletModal();
  const { isError, availableStake, isFetchedPosition, loading : loadingPosition, positions } = usePositionData();
  const [mobile, setMobile] = useState(false);
  const themeKey = useAtomValue(ThemeState.themeKey);

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 920 ? setMobile(true) : setMobile(false);
    }
  };
  useEffect(() => {
    updateTokenPrices();
    updatePositions();
    if (typeof window !== "undefined") {
      window.innerWidth < 920 ? setMobile(true) : setMobile(false);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const connect = useCallback(() => {
    if (!connected) {
      openModal();
    } else {
      switchNetwork();
    }
  }, [connectAdenaClient, isSwitchNetwork, switchNetwork, openModal, connected]);

  const moveEarnAdd = useCallback(() => {
    router.push("/earn/add");
  }, [router]);

  const movePoolDetail = useCallback((id: string) => {
    router.push(`/earn/pool/${id}`);
  }, [router]);

  const moveEarnStake = useCallback(() => {
    router.push("/earn/stake");
  }, [router]);


  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(Math.min(Math.floor(currentScrollX / 220) + 1, positions.length));
    }
  };

  const showPagination = useMemo(() => {
    if (width >= 920) {
      return false;
    } else {
      return true;
    }
  }, [positions, width]);

  const handleClickLoadMore = useCallback(() => {
    if (page === 1) {
      setPage(prev => prev + 1);
    } else {
      setPage(1);
    }
  }, [page]);

  const dataMapping = useMemo(() => {
    const temp = positions.sort((x,y) => Number(y.positionUsdValue) - Number(x.positionUsdValue));

    if (page === 1) {
      if (width > 1180) {
        return temp.slice(0, 4);
      } else if (width > 920) {
        return temp.slice(0, 3);
      } else return temp;
    } else return temp;
  }, [width, page, positions]);

  return (
    <EarnMyPositions
      connected={connected}
      availableStake={availableStake}
      connect={connect}
      loading={loading || loadingPosition}
      fetched={isFetchedPools && isFetchedPosition}
      isError={isError}
      positions={dataMapping}
      moveEarnAdd={moveEarnAdd}
      movePoolDetail={movePoolDetail}
      moveEarnStake={moveEarnStake}
      isSwitchNetwork={isSwitchNetwork}
      mobile={mobile}
      onScroll={handleScroll}
      divRef={divRef}
      currentIndex={currentIndex}
      showPagination={showPagination}
      showLoadMore={positions.length > 4}
      width={width}
      loadMore={page === 1}
      onClickLoadMore={handleClickLoadMore}
      themeKey={themeKey}
    />
  );
};

export default EarnMyPositionContainer;