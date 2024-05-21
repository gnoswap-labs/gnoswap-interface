import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MyLiquidity from "@components/pool/my-liquidity/MyLiquidity";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { usePosition } from "@hooks/common/use-position";
import { useLoading } from "@hooks/common/use-loading";
import {
  makeBroadcastClaimMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useGetUsernameByAddress } from "@query/address/queries";
import { toUnitFormat } from "@utils/number-utils";

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
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const { getPositionsByPoolId, loading } = usePositionData(address);
  const { isLoadingCommon } = useLoading();
  const { claimAll } = usePosition(positions);
  const [loadngTransactionClaim, setLoadingTransactionClaim] = useState(false);
  const [isShowClosePosition, setIsShowClosedPosition] = useState(false);
  const { openModal } = useTransactionConfirmModal();

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
    if ((!connectedWallet && !address)) {
      return false;
    }
    return true;
  }, [address, connectedWallet]);

  const { data: addressName = "" } = useGetUsernameByAddress(address || "", {
    enabled: !!address,
  });

  const showClosePositionButton = useMemo(() => {
    const haveClosedPosition = positions.some(item => item.closed);

    if (!connectedWallet || isSwitchNetwork || !haveClosedPosition) {
      return false;
    }
    return positions.length > 0;
  }, [connectedWallet, isSwitchNetwork, positions]);

  const availableRemovePosition = useMemo(() => {

    if (!connectedWallet || isSwitchNetwork) {
      return false;
    }
    return positions.length > 0;
  }, [connectedWallet, isSwitchNetwork, positions]);

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
    const amount = positions.flatMap(item => item.reward).reduce((acc, item) => acc + Number(item.claimableUsd), 0);
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

  useEffect(() => {
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    if (!visiblePositions) {
      return;
    }
    const temp = getPositionsByPoolId(poolPath);
    setPositions(temp);
  }, [
    router.query,
    visiblePositions,
    getPositionsByPoolId,
  ]);

  const filteredPosition = useMemo(() => {
    if (isShowClosePosition) return positions;

    return positions.filter(item => item.closed === false);
  }, [isShowClosePosition, positions]);

  const handleSetIsClosePosition = () => {
    setIsShowClosedPosition(!isShowClosePosition);
  };


  return (
    <MyLiquidity
      address={address || account?.address || null}
      addressName={addressName}
      isOtherPosition={isOtherPosition}
      positions={visiblePositions ? filteredPosition : []}
      breakpoint={breakpoint}
      connected={connectedWallet}
      isSwitchNetwork={isSwitchNetwork}
      handleClickAddPosition={handleClickAddPosition}
      handleClickRemovePosition={handleClickRemovePosition}
      divRef={divRef}
      onScroll={handleScroll}
      currentIndex={currentIndex}
      claimAll={claimAllReward}
      availableRemovePosition={availableRemovePosition}
      loading={loading || isLoadingCommon}
      loadngTransactionClaim={loadngTransactionClaim}
      isShowClosePosition={isShowClosePosition}
      handleSetIsClosePosition={handleSetIsClosePosition}
      isHiddenAddPosition={!!(address && account?.address && address !== account?.address || !account?.address)}
      showClosePositionButton={showClosePositionButton}
    />
  );
};

export default MyLiquidityContainer;
