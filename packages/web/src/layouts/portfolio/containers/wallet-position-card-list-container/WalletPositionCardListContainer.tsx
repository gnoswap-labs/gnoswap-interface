import { useAtomValue } from "jotai";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import useRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/data/use-pool-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { ThemeState } from "@states/index";
import { PositionConverter } from "@services/converters/position";
import { positionCardListBreakPoints } from "@common/values/breakpoint.constant";

const WalletPositionCardListContainer: React.FC<{ isClosed: boolean }> = ({ isClosed }) => {
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
  const isLoadingPosition = useMemo(() => connected && loadingPositions, [connected, loadingPositions]);

  const { pools, loading } = usePoolData();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { tokenPrices = {} } = useTokenData();

  const [isViewMorePositions, setIsViewMorePositions] = useState(false);
  const [mappedData, setMappedData] = useState<PoolPositionModel[]>([]);
  const [isDataMappingLoading, setIsDataMappingLoading] = useState(true);

  const handleClickLoadMore = useCallback(() => {
    setIsViewMorePositions(!isViewMorePositions);
  }, [isViewMorePositions]);

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
    (path: string) => {
      router.movePageWithPoolPath("POOL", router.getPoolPath() || path);
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

  const poolPositions = useMemo(() => {
    const mappedPositions: PoolPositionModel[] = [];
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
        mappedPositions.push(PositionMapper.makePoolPosition(position, temp));
      }
    });

    return mappedPositions;
  }, [pools, positionsData, getGnotPath]);

  const openPosition = useMemo(() => {
    return poolPositions
      .filter(item => !item.closed)
      .sort((x, y) => Number(y.positionUsdValue) - Number(x.positionUsdValue));
  }, [poolPositions]);

  const closedPosition = useMemo(() => {
    return poolPositions.filter(item => item.closed);
  }, [poolPositions]);

  const showedPosition = useMemo(() => {
    return [...openPosition, ...(isClosed ? closedPosition : [])];
  }, [closedPosition, isClosed, openPosition]);

  const handleScroll = useCallback(() => {
    if (divRef.current) {
      const container = divRef.current;
      const currentScrollX = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (currentScrollX >= maxScroll - 1) {
        setCurrentIndex(showedPosition.length);
      } else {
        setCurrentIndex(Math.min(Math.floor(currentScrollX / 322) + 1, showedPosition.length));
      }
    }
  }, [showedPosition.length]);

  const getMappedData = (): PoolPositionModel[] => {
    if (isViewMorePositions) {
      return showedPosition;
    }

    for (const breakpoint of positionCardListBreakPoints) {
      if (width > breakpoint.width) {
        return showedPosition.slice(0, breakpoint.displayCount);
      }
    }

    return showedPosition;
  };

  const updateDataMapping = useCallback(() => {
    setIsDataMappingLoading(true);
    const newMappedData = getMappedData();
    const convertedMappedData = PositionConverter.convertPositions(newMappedData);

    setMappedData(convertedMappedData);
    setIsDataMappingLoading(false);
  }, [isViewMorePositions, width, showedPosition]);

  useEffect(() => {
    updateDataMapping();
  }, [updateDataMapping]);

  const showLoadMore = useMemo(() => {
    return showedPosition.length > 4;
  }, [showedPosition]);

  return (
    <MyPositionCardList
      positions={mappedData}
      loadMore={!isViewMorePositions}
      isFetched={isFetchedPosition}
      isLoading={loading || isLoadingPosition || isDataMappingLoading}
      movePoolDetail={movePoolDetail}
      currentIndex={currentIndex}
      mobile={mobile}
      width={width}
      showPagination={showPagination}
      showLoadMore={showLoadMore}
      themeKey={themeKey}
      divRef={divRef}
      onScroll={handleScroll}
      tokenPrices={tokenPrices}
      onClickLoadMore={handleClickLoadMore}
    />
  );
};

export default WalletPositionCardListContainer;
