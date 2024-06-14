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
import { PositionModel } from "@models/position/position-model";

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
    (id: string) => {
      let query = "";
      if (address && address.length > 0) {
        query = `?addr=${address}`;
      }
      router.push(`/earn/pool/${id}${query}`);
    },
    [router, address],
  );

  const moveEarnStake = useCallback(() => {
    router.push(
      "/earn/pool/gno.land_r_demo_gns:gno.land_r_demo_wugnot:3000/#staking",
    );
  }, [router]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(
        Math.min(Math.floor(currentScrollX / 332) + 1, positions.length),
      );
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
    setIsViewMorePositions(!isViewMorePositions);
  }, [isViewMorePositions]);

  const dataMapping = useMemo(() => {
    let temp = positions;
    if (!isClosed) {
      temp = positions.filter((_: PositionModel) => _.closed === false);
    }
    temp = temp.sort(
      (x, y) => Number(y.positionUsdValue) - Number(x.positionUsdValue),
    );
    if (!isViewMorePositions) {
      if (width > 1180) {
        return temp.slice(0, 4);
      } else if (width > 920) {
        return temp.slice(0, 3);
      } else return temp;
    } else return temp;
  }, [positions, isClosed, isViewMorePositions, width]);

  const handleChangeClosed = () => {
    setIsClosed(!isClosed);
  };

  const allPositionLength = useMemo(() => positions.length, [positions]);
  const openPositionLength = useMemo(
    () => positions.filter((_: PositionModel) => _.closed === false).length,
    [positions],
  );

  const visiblePositions = useMemo(() => {
    const noClosedPosition = positions.every(item => !item.closed);

    if ((!connected && !address) || noClosedPosition) {
      return false;
    }
    return true;
  }, [address, connected, positions]);

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
      positionLength={isClosed ? allPositionLength : openPositionLength}
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
      showLoadMore={positions.length > 4}
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
