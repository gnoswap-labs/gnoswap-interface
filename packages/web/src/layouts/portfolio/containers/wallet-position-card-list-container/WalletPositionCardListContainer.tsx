import { useAtomValue } from "jotai";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import useRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/data/use-pool-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetAllTokenPrices } from "@query/token";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { ThemeState } from "@states/index";
import { PositionConverter } from "@services/converters/position";
import { POSITION_CARD_BREAKPOINTS, POSITION_CARD_DISPLAY_COUNT, POSITION_CARD_LIST_BREAKPOINTS } from "@common/values";

interface WalletPositionCardListContainerProps {
  /** UI toggle state: whether closed positions should be shown in this view. */
  isClosed: boolean;
}

const WalletPositionCardListContainer: React.FC<WalletPositionCardListContainerProps> = ({ isClosed }) => {
  const { getGnotPath } = useGnotToGnot();
  const [currentIndex, setCurrentIndex] = useState(1);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const { width } = useWindowSize();
  const { connected } = useWallet();
  const [page, setPage] = useState(1);

  const limit = useMemo(() => {
    const { DESKTOP_MIN, TABLET_MIN } = POSITION_CARD_BREAKPOINTS;
    const { DESKTOP, TABLET } = POSITION_CARD_DISPLAY_COUNT;

    if (width < DESKTOP_MIN && width >= TABLET_MIN) {
      return TABLET * 7;
    }
    return DESKTOP * 5;
  }, [width]);

  const {
    isFetchedPosition,
    loading: loadingPositions,
    positions: positionsData = [],
    totalPositionCount,
  } = usePositionData({
    withClosed: isClosed,
    page,
    limit,
  });

  const isLoadingPosition = useMemo(() => connected && loadingPositions, [connected, loadingPositions]);

  const { pools, loading } = usePoolData();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { data: tokenPrices = {} } = useGetAllTokenPrices();

  const [isViewMorePositions, setIsViewMorePositions] = useState(false);

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

  const showPositionIndicator = useMemo(() => {
    if (width >= 920) {
      return false;
    } else {
      return true;
    }
  }, [width]);

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
            displaySymbol: getGnotPath(pool.tokenA).displaySymbol,
            logoURI: getGnotPath(pool.tokenA).logoURI,
          },
          tokenB: {
            ...pool.tokenB,
            symbol: getGnotPath(pool.tokenB).symbol,
            displaySymbol: getGnotPath(pool.tokenB).displaySymbol,
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
      const itemGap = 12;
      const parentWidth = divRef.current.clientWidth;
      const children = divRef.current.children;
      const listChildWidth = divRef.current.children[0].clientWidth;
      const childrenLength = showedPosition.length;

      const totalItemWidth = childrenLength * listChildWidth;
      const totalGapWidth = itemGap * (childrenLength - 1);

      const maxScrollWidth = totalItemWidth + totalGapWidth - parentWidth;
      const currentScrollX = divRef.current.scrollLeft;

      const maybeNextDisplayIndex = Math.floor(currentScrollX / (listChildWidth + itemGap)) + 2;

      const centerScreenX = document.body.clientWidth / 2;

      if (currentScrollX === 0) {
        setCurrentIndex(1);
        return;
      }

      if (maxScrollWidth <= currentScrollX) {
        setCurrentIndex(childrenLength);
        return;
      }

      const getLengthFromElementCenterToScreenCenter = (element: Element | null) => {
        if (element) return Math.abs(element?.getBoundingClientRect().x + listChildWidth / 2 - centerScreenX);

        return -1;
      };

      const checkValidElement = (index: number) => {
        if (index < childrenLength) {
          return children[index];
        }
        return null;
      };

      if (childrenLength >= 3) {
        const maybeNextIndex = maybeNextDisplayIndex - 1;

        const previous1Element = checkValidElement(maybeNextIndex - 1);
        const currentElement = checkValidElement(maybeNextIndex);
        const next1Element = checkValidElement(maybeNextIndex + 1);

        const previousElementCenterXToScreenCenterX = getLengthFromElementCenterToScreenCenter(previous1Element);
        const currentElementCenterXToScreenCenterX = getLengthFromElementCenterToScreenCenter(currentElement);
        const nextElementCenterXToScreenCenterX = getLengthFromElementCenterToScreenCenter(next1Element);

        const minLength = Math.min(
          ...[
            previousElementCenterXToScreenCenterX,
            currentElementCenterXToScreenCenterX,
            nextElementCenterXToScreenCenterX,
          ],
        );

        const distanceMap = {
          [previousElementCenterXToScreenCenterX]: maybeNextDisplayIndex - 1,
          [currentElementCenterXToScreenCenterX]: maybeNextDisplayIndex,
          [nextElementCenterXToScreenCenterX]: maybeNextDisplayIndex + 1,
        };

        const nextIndex = distanceMap[minLength];

        if (nextIndex > childrenLength) {
          setCurrentIndex(childrenLength);
          return;
        }

        if (nextIndex < 1) {
          setCurrentIndex(1);
          return;
        }

        setCurrentIndex(nextIndex);
      }
    }
  }, [showedPosition.length]);

  const mappedData = useMemo(() => {
    let targetPositions: PoolPositionModel[];

    if (isViewMorePositions) {
      targetPositions = showedPosition;
    } else {
      targetPositions = showedPosition;
      for (const breakpoint of POSITION_CARD_LIST_BREAKPOINTS) {
        if (width > breakpoint.width) {
          targetPositions = showedPosition.slice(0, breakpoint.displayCount);
          break;
        }
      }
    }

    return PositionConverter.convertPositions(targetPositions);
  }, [isViewMorePositions, width, showedPosition]);

  /**
   * Navigate to specific page
   */
  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  /**
   * Calculate total number of pages based on server total count
   */
  const totalPage = useMemo(() => {
    return Math.ceil(totalPositionCount / limit);
  }, [totalPositionCount, limit]);

  const maxDisplayCount = useMemo(() => {
    const { DESKTOP_MIN, TABLET_MIN } = POSITION_CARD_BREAKPOINTS;
    const { DESKTOP, TABLET } = POSITION_CARD_DISPLAY_COUNT;

    return width < DESKTOP_MIN && width >= TABLET_MIN ? TABLET : DESKTOP;
  }, [width]);

  const showLoadMore = useMemo(() => {
    return showedPosition.length > 4;
  }, [showedPosition]);

  /**
   * Reset page to first page when filter criteria change
   */
  useEffect(() => {
    setPage(1);
  }, [isClosed]);

  return (
    <MyPositionCardList
      positions={mappedData}
      loadMore={!isViewMorePositions}
      isFetched={isFetchedPosition}
      isLoading={loading || isLoadingPosition}
      movePoolDetail={movePoolDetail}
      currentIndex={currentIndex}
      maxDisplayCount={maxDisplayCount}
      mobile={mobile}
      width={width}
      showPositionIndicator={showPositionIndicator}
      showLoadMore={showLoadMore}
      themeKey={themeKey}
      divRef={divRef}
      onScroll={handleScroll}
      tokenPrices={tokenPrices}
      onClickLoadMore={handleClickLoadMore}
      currentPage={page}
      totalPage={totalPage}
      movePage={movePage}
    />
  );
};

export default WalletPositionCardListContainer;
