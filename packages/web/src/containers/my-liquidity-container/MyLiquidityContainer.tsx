import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import MyLiquidity from "@components/pool/my-liquidity/MyLiquidity";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import useRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePosition } from "@hooks/common/use-position";
import {
  makeBroadcastClaimMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useGetUsernameByAddress } from "@query/address/queries";
import { toUnitFormat } from "@utils/number-utils";
import { useTokenData } from "@hooks/token/use-token-data";
import { encryptId } from "@utils/common";

interface MyLiquidityContainerProps {
  address?: string | undefined;
}


const MyLiquidityContainer: React.FC<MyLiquidityContainerProps> = ({
  address,
}) => {
  const router = useRouter();
  const divRef = useRef<HTMLDivElement | null>(null);
  const { breakpoint } = useWindowSize();
  const { connected: connectedWallet, isSwitchNetwork, account } = useWallet();
  const [currentIndex, setCurrentIndex] = useState(1);
  const poolPath = (router.query["pool-path"] ?? "") as string;
  const { positions: positions, loading: isLoadingPosition } = usePositionData({
    address,
    poolPath: encryptId(poolPath),
    queryOption: {
      enabled: !!poolPath
    }
  });

  const { claimAll } = usePosition(positions);
  const [loadingTransactionClaim, setLoadingTransactionClaim] = useState(false);
  const [isShowClosePosition, setIsShowClosedPosition] = useState(false);
  const { openModal } = useTransactionConfirmModal();
  const { tokenPrices } = useTokenData();


  const {
    broadcastSuccess,
    broadcastPending,
    broadcastError,
    broadcastRejected,
  } = useBroadcastHandler();

  const isOtherPosition = useMemo(() => {
    return Boolean(address) && address !== account?.address;
  }, [account?.address, address]);

  const visiblePositions = useMemo(() => {
    if (!connectedWallet && !address) {
      return false;
    }
    return true;
  }, [address, connectedWallet]);

  const { data: addressName = "" } = useGetUsernameByAddress(address || "", {
    enabled: !!address,
  });





  const handleClickAddPosition = useCallback(() => {
    router.push(`/earn/pool/${router.query["pool-path"]}/add`);
  }, [router]);

  const handleClickRemovePosition = useCallback(() => {
    router.push(`/earn/pool/${router.query["pool-path"]}/remove`);
  }, [router]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(
        Math.floor(currentScrollX / divRef.current.offsetWidth) + 1,
      );
    }
  };

  const claimAllReward = useCallback(() => {
    const amount = positions
      .flatMap(item => item.reward)
      .reduce((acc, item) => acc + Number(item.claimableUsd), 0);
    const data = {
      amount: toUnitFormat(amount, true, true),
    };

    setLoadingTransactionClaim(true);
    claimAll().then(response => {
      if (response) {
        if (response.code === 0) {
          broadcastPending();
          setTimeout(() => {
            broadcastSuccess(makeBroadcastClaimMessage("success", data));
            setLoadingTransactionClaim(false);
          }, 1000);
          openModal();
        } else if (
          response.code === 4000 &&
          response.type !== ERROR_VALUE.TRANSACTION_REJECTED.type
        ) {
          broadcastError(makeBroadcastClaimMessage("error", data));
          setLoadingTransactionClaim(false);
          openModal();
        } else {
          openModal();
          broadcastRejected(
            makeBroadcastClaimMessage("error", data),
            () => { },
            true,
          );
          setLoadingTransactionClaim(false);
        }
      }
    });
  }, [claimAll, router, setLoadingTransactionClaim, positions, openModal]);

  const handleSetIsClosePosition = () => {
    setIsShowClosedPosition(!isShowClosePosition);
  };

  const openedPosition = useMemo(() => {
    return positions.filter(item => !item.closed)
      .filter(item => !item.closed)
      .sort((a, b) => Number(b.positionUsdValue) - Number(a.positionUsdValue)) ?? [];
  }, [positions]);

  const closedPosition = useMemo(() => {
    return positions
      .filter(item => item.closed)
      .sort((a, b) => {
        return Number(a.id ?? 0) - Number(b.id ?? 0);
      }) ?? [];
  }, [positions]);

  const haveClosedPosition = useMemo(
    () => closedPosition.length > 0,
    [closedPosition.length],
  );
  const haveNotClosedPosition = useMemo(
    () => openedPosition.length > 0,
    [openedPosition.length],
  );

  const showClosePositionButton = useMemo(() => {
    if (!connectedWallet || isSwitchNetwork) {
      return false;
    }
    return haveClosedPosition;
  }, [connectedWallet, haveClosedPosition, isSwitchNetwork]);

  const isShowRemovePositionButton = useMemo(() => {
    if (!connectedWallet || isSwitchNetwork) {
      return false;
    }
    return haveNotClosedPosition;
  }, [connectedWallet, haveNotClosedPosition, isSwitchNetwork]);

  return (
    <MyLiquidity
      address={address || account?.address || null}
      addressName={addressName}
      isOtherPosition={isOtherPosition}
      positions={visiblePositions ? openedPosition : []}
      closedPosition={closedPosition}
      breakpoint={breakpoint}
      connected={connectedWallet}
      isSwitchNetwork={isSwitchNetwork}
      handleClickAddPosition={handleClickAddPosition}
      handleClickRemovePosition={handleClickRemovePosition}
      divRef={divRef}
      onScroll={handleScroll}
      currentIndex={currentIndex}
      claimAll={claimAllReward}
      isShowRemovePositionButton={isShowRemovePositionButton}
      loading={isLoadingPosition}
      loadingTransactionClaim={loadingTransactionClaim}
      isShowClosePosition={isShowClosePosition}
      handleSetIsClosePosition={handleSetIsClosePosition}
      isHiddenAddPosition={
        !!(
          (address && account?.address && address !== account?.address) ||
          !account?.address
        )
      }
      showClosePositionButton={showClosePositionButton}
      tokenPrices={tokenPrices}
    />
  );
};

export default MyLiquidityContainer;
