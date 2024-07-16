import EarnMyPositions from "@components/earn/earn-my-positions/EarnMyPositions";
import { usePositionData } from "@hooks/common/use-position-data";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useTokenData } from "@hooks/token/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import useRouter from "@hooks/common/use-custom-router";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { ValuesType } from "utility-types";
import { useAtom, useAtomValue } from "jotai";
import { EarnState, ThemeState } from "@states/index";
import { useGetUsernameByAddress } from "@query/address/queries";
import { DEFAULT_POOL_ID } from "@constants/common.constant";

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
  address?: string | undefined;
  isOtherPosition?: boolean;
}

const EarnMyPositionContainer: React.FC<EarnMyPositionContainerProps> = ({
  address,
  isOtherPosition,
}) => {
  const router = useRouter();
  const {
    connected,
    connectAdenaClient,
    isSwitchNetwork,
    switchNetwork,
    account,
  } = useWallet();
  const { tokenPrices = {}, updateTokenPrices } = useTokenData();
  const { isFetchedPools, loading: isLoadingPool, pools } = usePoolData();
  const { width } = useWindowSize();
  const { openModal } = useConnectWalletModal();
  const {
    isError,
    availableStake,
    isFetchedPosition,
    loading: isLoadingPosition,
    positions,
  } = usePositionData({ address });
  const [isViewMorePositions, setIsViewMorePositions] = useAtom(
    EarnState.isViewMorePositions,
  );

  const themeKey = useAtomValue(ThemeState.themeKey);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [mobile, setMobile] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const divRef = useRef<HTMLDivElement | null>(null);

  const { data: addressName = "" } = useGetUsernameByAddress(address || "", {
    enabled: !!address,
  });

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 920 ? setMobile(true) : setMobile(false);
    }
  };
  useEffect(() => {
    updateTokenPrices();
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
  }, [
    connectAdenaClient,
    isSwitchNetwork,
    switchNetwork,
    openModal,
    connected,
  ]);

  const moveEarnAdd = useCallback(() => {
    router.push("/earn/add");
  }, [router]);

  const movePoolDetail = useCallback(
    (poolId: string, positionId: string) => {
      const query = address && address.length > 0 ? `?addr=${address}` : "";
      const positionHash = `#${positionId}`;

      router.push(`/earn/pool/${poolId}${query}${positionHash}`);
    },
    [router, address],
  );

  const moveEarnStake = useCallback(() => {
    const stakingUri = `/earn/pool/${DEFAULT_POOL_ID}#staking`;
    router.push(stakingUri);
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
  }, [closedPosition, isClosed, openPosition]);

  const dataMapping = useMemo(() => {
    if (!isViewMorePositions) {
      if (width > 1180) {
        return showedPosition.slice(0, 4);
      }
      if (width > 920) {
        return showedPosition.slice(0, 3);
      }
    }
    return showedPosition;
  }, [isViewMorePositions, width, showedPosition]);

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

      const maybeNextDisplayIndex =
        Math.floor(currentScrollX / (listChildWidth + itemGap)) + 2;

      const centerScreenX = document.body.clientWidth / 2;

      if (currentScrollX === 0) {
        setCurrentIndex(1);
        return;
      }

      if (maxScrollWidth <= currentScrollX) {
        setCurrentIndex(childrenLength);
        return;
      }

      const getLengthFromElementCenterToScreenCenter = (
        element: Element | null,
      ) => {
        if (element)
          return Math.abs(
            element?.getBoundingClientRect().x +
              listChildWidth / 2 -
              centerScreenX,
          );

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

        const previousElementCenterXToScreenCenterX =
          getLengthFromElementCenterToScreenCenter(previous1Element);
        const currentElementCenterXToScreenCenterX =
          getLengthFromElementCenterToScreenCenter(currentElement);
        const nextElementCenterXToScreenCenterX =
          getLengthFromElementCenterToScreenCenter(next1Element);

        const minLength = Math.min(
          ...[
            previousElementCenterXToScreenCenterX,
            currentElementCenterXToScreenCenterX,
            nextElementCenterXToScreenCenterX,
          ],
        );

        let nextIndex = maybeNextDisplayIndex;

        switch (minLength) {
          case previousElementCenterXToScreenCenterX:
            nextIndex = maybeNextDisplayIndex - 1;
            break;
          case nextElementCenterXToScreenCenterX:
            nextIndex = maybeNextDisplayIndex + 1;
            break;
          case currentElementCenterXToScreenCenterX:
            nextIndex = maybeNextDisplayIndex;
            break;
        }

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

  const showPagination = useMemo(() => {
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
  };

  const visiblePositions = useMemo(() => {
    const noClosedPosition = closedPosition.length <= 0;

    if ((!connected && !address) || noClosedPosition) {
      return false;
    }
    return true;
  }, [address, closedPosition.length, connected]);

  const highestApr = useMemo(() => {
    return pools.reduce((acc, current) => {
      if (Number(current.totalApr) > acc) {
        return Number(current.totalApr);
      }
      return acc;
    }, Number(pools?.[0]?.totalApr ?? 0));
  }, [pools]);

  return (
    <EarnMyPositions
      address={address}
      addressName={addressName}
      isOtherPosition={!!isOtherPosition}
      visiblePositions={visiblePositions}
      positionLength={showedPosition.length}
      connected={connected}
      availableStake={availableStake}
      connect={connect}
      loading={
        isLoadingPool ||
        (connected ? isLoadingPosition || !isFetchedPosition : false)
      }
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
      showLoadMore={showedPosition.length > 4}
      width={width}
      loadMore={!isViewMorePositions}
      onClickLoadMore={handleClickLoadMore}
      themeKey={themeKey}
      account={account}
      isClosed={isClosed}
      handleChangeClosed={handleChangeClosed}
      tokenPrices={tokenPrices}
      highestApr={highestApr}
    />
  );
};

export default EarnMyPositionContainer;
