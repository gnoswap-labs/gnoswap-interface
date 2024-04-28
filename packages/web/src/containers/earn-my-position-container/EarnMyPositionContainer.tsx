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
import { useGetUsernameByAddress } from "@query/address/queries";
import { useLoading } from "@hooks/common/use-loading";
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

const EarnMyPositionContainer: React.FC<
  EarnMyPositionContainerProps
> = ({
  address,
  isOtherPosition,
}) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [page, setPage] = useState(1);

    const router = useRouter();

    const { connected, connectAdenaClient, isSwitchNetwork, switchNetwork, account } = useWallet();
    const { updateTokenPrices } = useTokenData();
    const { updatePositions, isFetchedPools, loading: isLoadingPool } = usePoolData();
    const { width } = useWindowSize();
    const divRef = useRef<HTMLDivElement | null>(null);
    const { openModal } = useConnectWalletModal();
    const { isError, availableStake, isFetchedPosition, loading: isLoadingPosition, positions } = usePositionData(address);
    const [mobile, setMobile] = useState(false);
    const themeKey = useAtomValue(ThemeState.themeKey);
    const [isClosed, setIsClosed] = useState(false);
    const { isLoadingCommon } = useLoading();

    const visiblePositions = useMemo(() => {
      if (!connected && !address) {
        return false;
      }
      return true;
    }, [address, connected]);

    const { data: addressName = "" } = useGetUsernameByAddress(address || "", { enabled: !!address });

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
      let query = "";
      if (address && address.length > 0) {
        query = `?addr=${address}`;
      }
      router.push(`/earn/pool/${id}${query}`);
    }, [router, address]);

    const moveEarnStake = useCallback(() => {
      router.push("/earn/pool/gno.land_r_demo_gns:gno.land_r_demo_wugnot:3000/staking");
    }, [router]);


    const handleScroll = () => {
      if (divRef.current) {
        const currentScrollX = divRef.current.scrollLeft;
        setCurrentIndex(Math.min(Math.floor(currentScrollX / 332) + 1, positions.length));
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
      let temp = positions;
      if (!isClosed) {
        temp = positions.filter((_: PositionModel) => _.closed === false);
      }
      temp = temp.sort((x, y) => Number(y.positionUsdValue) - Number(x.positionUsdValue));
      if (page === 1) {
        if (width > 1180) {
          return temp.slice(0, 4);
        } else if (width > 920) {
          return temp.slice(0, 3);
        } else return temp;
      } else return temp;
    }, [width, page, positions, isClosed]);

    const handleChangeClosed = () => {
      setIsClosed(!isClosed);
    };

    return (
      <EarnMyPositions
        address={address}
        addressName={addressName}
        isOtherPosition={!!isOtherPosition}
        visiblePositions={visiblePositions}
        positionLength={positions.length}
        connected={connected}
        availableStake={availableStake}
        connect={connect}
        loading={isLoadingPool || isLoadingCommon || (connected ? (isLoadingPosition || !isFetchedPosition) : false)}
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
        account={account}
        isClosed={isClosed}
        handleChangeClosed={handleChangeClosed}
      />
    );
  };

export default EarnMyPositionContainer;