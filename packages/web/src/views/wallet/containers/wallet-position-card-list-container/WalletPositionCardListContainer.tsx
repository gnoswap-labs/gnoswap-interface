import { useAtomValue } from "jotai";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import useRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { ThemeState } from "@states/index";

const WalletPositionCardListContainer: React.FC = () => {
  const { getGnotPath } = useGnotToGnot();
  const [currentIndex, setCurrentIndex] = useState(1);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const { width } = useWindowSize();
  const { connected } = useWallet();
  const {
    isFetchedPosition,
    loading: loadingPositions,
    positions: positionsData = [],
  } = usePositionData({
    isClosed: false,
  });
  const isLoadingPosition = useMemo(
    () => connected && loadingPositions,
    [connected, loadingPositions],
  );

  const { pools, loading } = usePoolData();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { isSwitchNetwork } = useWallet();
  const { tokenPrices = {} } = useTokenData();

  const handleResize = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 920) setMobile(true);
      else setMobile(false);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const movePoolDetail = useCallback(
    (id: string) => {
      router.movePageWithPoolPath("POOL", router.getPoolPath() || id);
    },
    [router],
  );

  const showPagination = useMemo(() => {
    if (width >= 920) {
      return false;
    } else {
      return true;
    }
  }, [positionsData, width]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(
        Math.min(Math.floor(currentScrollX / 322) + 1, positions.length),
      );
    }
  };

  const positions = useMemo(() => {
    const poolPositions: PoolPositionModel[] = [];
    positionsData.forEach(position => {
      const pool = pools.find(pool => pool.poolPath === position.poolPath);
      if (pool) {
        const temp = {
          ...pool,
          tokenA: {
            ...pool.tokenA,
            symbol: getGnotPath(pool.tokenA).symbol,
            logoURI: getGnotPath(pool.tokenA).logoURI,
          },
          tokenB: {
            ...pool.tokenB,
            symbol: getGnotPath(pool.tokenB).symbol,
            logoURI: getGnotPath(pool.tokenB).logoURI,
          },
        };
        poolPositions.push(PositionMapper.makePoolPosition(position, temp));
      }
    });
    return poolPositions;
  }, [pools, positionsData]);

  const sortedData = positions.sort(
    (x, y) => Number(y.positionUsdValue) - Number(x.positionUsdValue),
  );
  if (!isFetchedPosition || isSwitchNetwork) return null;

  return (
    <MyPositionCardList
      positions={sortedData}
      loadMore={false}
      isFetched={isFetchedPosition}
      isLoading={loading || isLoadingPosition}
      movePoolDetail={movePoolDetail}
      currentIndex={currentIndex}
      mobile={mobile}
      width={width}
      showPagination={showPagination}
      showLoadMore={true}
      themeKey={themeKey}
      divRef={divRef}
      onScroll={handleScroll}
      tokenPrices={tokenPrices}
    />
  );
};

export default WalletPositionCardListContainer;
