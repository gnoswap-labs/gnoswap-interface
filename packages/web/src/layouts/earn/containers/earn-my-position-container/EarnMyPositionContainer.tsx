import { useAtom, useAtomValue } from "jotai";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DEFAULT_POOL_PATH } from "@constants/common.constant";
import { QUERY_PARAMETER } from "@constants/page.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/data/use-pool-data";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetUsernameByAddress } from "@query/address";
import { EarnState, ThemeState } from "@states/index";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { POSITION_CARD_BREAKPOINTS, POSITION_CARD_DISPLAY_COUNT, POSITION_CARD_LIST_BREAKPOINTS } from "@common/values";

import EarnMyPositions from "../../components/earn-my-positions/EarnMyPositions";
import { PositionConverter } from "@services/converters/position";

interface EarnMyPositionContainerProps {
  loadMore?: boolean;
  address?: string | undefined;
  isOtherPosition?: boolean;
  onOpenVideoGuide: (type: "POSITION") => void;
}

const EarnMyPositionContainer: React.FC<EarnMyPositionContainerProps> = ({
  address,
  isOtherPosition,
  onOpenVideoGuide,
}) => {
  const router = useCustomRouter();
  const { connected, connectAdenaClient, isSwitchNetwork, switchNetwork, account } = useWallet();
  const { tokenPrices = {}, updateTokenPrices } = useTokenData();
  const { isFetchedPools, loading: isLoadingPool, pools } = usePoolData();
  const { width } = useWindowSize();
  const { openModal } = useConnectWalletModal();
  const [isViewMorePositions, setIsViewMorePositions] = useAtom(EarnState.isViewMorePositions);

  const themeKey = useAtomValue(ThemeState.themeKey);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [mobile, setMobile] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [page, setPage] = useState(1);

  const limit = useMemo(() => {
    const { DESKTOP_MIN, TABLET_MIN } = POSITION_CARD_BREAKPOINTS;
    const { DESKTOP, TABLET } = POSITION_CARD_DISPLAY_COUNT;

    if (width < DESKTOP_MIN && width >= TABLET_MIN) {
      return TABLET * 7; // 3 * 7 = 21
    }
    return DESKTOP * 5; // 4 * 5 = 20
  }, [width]);

  const {
    isError,
    availableStake,
    isFetchedPosition,
    loading: isLoadingPosition,
    positions,
    totalPositionCount,
  } = usePositionData({
    address,
    page,
    limit,
  });

  const [mappedData, setMappedData] = useState<PoolPositionModel[]>([]);
  const [isDataMappingLoading, setIsDataMappingLoading] = useState(true);

  const divRef = useRef<HTMLDivElement | null>(null);

  const { data: addressName = "" } = useGetUsernameByAddress(address || "", {
    enabled: !!address,
  });

  const handleResize = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 920) setMobile(true);
      else setMobile(false);
    }
  };
  useEffect(() => {
    updateTokenPrices();
    if (typeof window !== "undefined") {
      if (window.innerWidth < 920) setMobile(true);
      else setMobile(false);
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
    router.movePage("EARN_ADD");
  }, [router]);

  const movePoolDetail = useCallback(
    (poolId: string, positionId: number) => {
      router.movePage(
        "POOL",
        {
          [QUERY_PARAMETER.POOL_PATH]: poolId,
          [QUERY_PARAMETER.ADDRESS]: address,
        },
        positionId,
      );
    },
    [router, address],
  );

  const moveEarnStake = useCallback(() => {
    router.movePageWithPoolPath("POOL", DEFAULT_POOL_PATH, "staking");
  }, [router]);

  const openPosition = useMemo(() => {
    return positions
      .filter(item => !item.closed)
      .sort((x, y) => Number(y.positionUsdValue) - Number(x.positionUsdValue));
  }, [positions]);

  const closedPosition = useMemo(() => {
    return positions.filter(item => item.closed);
  }, [positions]);

  const showedPosition = useMemo(() => {
    return [...openPosition, ...(isClosed ? closedPosition : [])];
  }, [closedPosition, isClosed, openPosition, limit]);

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

  const showPositionIndicator = useMemo(() => {
    if (width >= 920) {
      return false;
    } else {
      return true;
    }
  }, [width]);

  const handleClickLoadMore = useCallback(() => {
    setIsViewMorePositions(!isViewMorePositions);
  }, [isViewMorePositions]);

  const handleChangeClosed = () => {
    setIsClosed(!isClosed);
    setPage(1);
  };

  /**
   * Navigate to specific page
   */
  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const visiblePositions = useMemo(() => {
    const noClosedPosition = closedPosition.length <= 0;

    if ((!connected && !address) || noClosedPosition) {
      return false;
    }
    return true;
  }, [address, closedPosition.length, connected]);

  const getMappedData = (): PoolPositionModel[] => {
    if (isViewMorePositions) {
      return showedPosition;
    }

    for (const breakpoint of POSITION_CARD_LIST_BREAKPOINTS) {
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
  }, [isViewMorePositions, width, showedPosition, limit]);

  useEffect(() => {
    updateDataMapping();
  }, [updateDataMapping]);

  const highestApr = useMemo(() => {
    return pools.reduce((acc, current) => {
      if (Number(current.totalApr) > acc) {
        return Number(current.totalApr);
      }
      return acc;
    }, Number(pools?.[0]?.totalApr ?? 0));
  }, [pools]);

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
    return showedPosition.length > maxDisplayCount;
  }, [showedPosition, maxDisplayCount]);

  /**
   * Reset page to first page when filter criteria change
   */
  useEffect(() => {
    setPage(1);
  }, [isClosed]);

  return (
    <EarnMyPositions
      address={address}
      addressName={addressName}
      isOtherPosition={!!isOtherPosition}
      visiblePositions={visiblePositions}
      positionLength={totalPositionCount}
      connected={connected}
      availableStake={availableStake}
      connect={connect}
      loading={isLoadingPool || (connected ? isLoadingPosition || !isFetchedPosition : false) || isDataMappingLoading}
      loadingPositionCardList={isLoadingPool || isLoadingPosition || isDataMappingLoading}
      fetched={isFetchedPools && isFetchedPosition}
      isError={isError}
      positions={mappedData}
      moveEarnAdd={moveEarnAdd}
      movePoolDetail={movePoolDetail}
      moveEarnStake={moveEarnStake}
      isSwitchNetwork={isSwitchNetwork}
      mobile={mobile}
      onScroll={handleScroll}
      divRef={divRef}
      currentIndex={currentIndex}
      maxDisplayCount={maxDisplayCount}
      showPositionIndicator={showPositionIndicator}
      showLoadMore={showLoadMore}
      width={width}
      loadMore={!isViewMorePositions}
      onClickLoadMore={handleClickLoadMore}
      themeKey={themeKey}
      account={account}
      isClosed={isClosed}
      handleChangeClosed={handleChangeClosed}
      tokenPrices={tokenPrices}
      highestApr={highestApr}
      onOpenVideoGuide={onOpenVideoGuide}
      currentPage={page}
      totalPage={totalPage}
      movePage={movePage}
      limit={limit}
    />
  );
};

export default EarnMyPositionContainer;
