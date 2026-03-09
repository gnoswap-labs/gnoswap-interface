import React, { useCallback, useMemo, useRef, useState } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import useRouter from "@hooks/common/use-custom-router";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePosition } from "@hooks/pool/data/use-position";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetUsernameByAddress } from "@query/address";
import { QUERY_KEY } from "@query/query-keys";
import { DexEvent } from "@repositories/common";
import { delay } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";

import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionConverter } from "@services/converters/position";
import MyLiquidity from "../../components/my-liquidity/MyLiquidity";

interface MyLiquidityContainerProps {
  addressContext: {
    urlAddress: string;
    connectAddress: string;
    isOwner: boolean;
  };
  isStakable: boolean;
}

const MyLiquidityContainer: React.FC<MyLiquidityContainerProps> = ({ isStakable, addressContext }) => {
  const { rpcProvider } = useGnoswapContext();
  const { urlAddress, connectAddress } = addressContext;

  const address = useMemo(() => {
    return urlAddress || connectAddress;
  }, [urlAddress, connectAddress]);

  const router = useRouter();
  const divRef = useRef<HTMLDivElement | null>(null);
  const { breakpoint } = useWindowSize();
  const { connected: connectedWallet, isSwitchNetwork, account, currentChainId } = useWallet();
  const [currentIndex, setCurrentIndex] = useState(1);
  const poolPath = router.getPoolPath();
  const { positions: positions, loading: isLoadingPosition, refetch: refetchPositions } = usePositionData({
    address,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const { invalidateQueryKey } = useInvalidateQueries();

  const handleRefreshData = useCallback(async () => {
    invalidateQueryKey("MyLiquidity, Claim", [
      [QUERY_KEY.tokenBalancesByAddress, address],
      [QUERY_KEY.positions, currentChainId, address],
      [QUERY_KEY.poolPairBins],
    ]);
  }, [invalidateQueryKey, currentChainId, address]);

  const { claimAll, claim } = usePosition(positions.filter(item => !item.closed));
  const [loadingTransactionClaim, setLoadingTransactionClaim] = useState(false);
  const [isShowClosePosition, setIsShowClosedPosition] = useState(false);
  const { openModal } = useTransactionConfirmModal();
  const { tokenPrices, updateBalances, refetchGrc20Balances } = useTokenData();

  const { getMessage } = useMessage();

  const { broadcastSuccess, broadcastError, broadcastRejected, broadcastLoading } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  const isOtherPosition = useMemo(() => {
    return Boolean(address) && address !== account?.address;
  }, [account?.address, address]);

  const accountPositions: PoolPositionModel[] = useMemo(() => {
    if (!address || !poolPath) return [];

    const filteredPositions = positions.filter(position => position.poolPath === poolPath);
    return PositionConverter.convertPositions(filteredPositions);
  }, [address, poolPath, positions]);

  const visiblePositions = useMemo(() => {
    if (!address) {
      return false;
    }
    return true;
  }, [address]);

  const { data: addressName = "" } = useGetUsernameByAddress(address || "", {
    enabled: !!address,
  });

  const handleClickAddPosition = useCallback(() => {
    if (!poolPath) {
      return;
    }
    router.movePageWithPoolPath("POOL_ADD", poolPath);
  }, [poolPath]);

  const handleClickRemovePosition = useCallback(() => {
    if (!poolPath) {
      return;
    }
    router.movePageWithPoolPath("POOL_REMOVE", poolPath);
  }, [poolPath]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(Math.floor(currentScrollX / divRef.current.offsetWidth) + 1);
    }
  };

  const openedPosition = useMemo(() => {
    if (!address) {
      return [];
    }
    return (
      accountPositions
        .filter(item => !item.closed)
        .sort((a, b) => Number(b.positionUsdValue) - Number(a.positionUsdValue)) ?? []
    );
  }, [address, accountPositions]);

  const claimReward = useCallback(
    async (position: PoolPositionModel) => {
      if (!position) return;

      const amount = position.rewards.reduce((acc, item) => acc + Number(item.claimableUsd || 0), 0);

      const messageData = {
        tokenAAmount: formatOtherPrice(amount, { isKMB: false }),
      };

      broadcastLoading(getMessage(DexEvent.CLAIM_FEE, "pending", messageData));

      setLoadingTransactionClaim(true);
      claim(rpcProvider, position).then(response => {
        if (response) {
          if (response.code === 0 || response.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
            enqueueEvent({
              txHash: response?.data?.hash,
              action: DexEvent.CLAIM_FEE,
              visibleEmitResult: true,
              checkWugnotTransfer: true,
              formatData: () => {
                return messageData;
              },
              onUpdate: async () => {
                updateBalances();
              },
              onEmit: async () => {
                await delay(5000);
                handleRefreshData();
              },
              onSuccess: handleRefreshData,
            });
          }

          if (response.code === 0) {
            broadcastSuccess(getMessage(DexEvent.CLAIM_FEE, "success", messageData, response?.data?.hash));
            setLoadingTransactionClaim(false);
            openModal();
          } else if (response.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
            broadcastRejected(getMessage(DexEvent.CLAIM_FEE, "error", messageData), () => {});
            setLoadingTransactionClaim(false);
            openModal();
          } else {
            openModal();
            broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
            setLoadingTransactionClaim(false);
          }
        }
      });
    },
    [claim, refetchPositions, updateBalances],
  );

  const claimAllReward = () => {
    const amount = openedPosition
      .filter(item => !item.closed)
      .flatMap(item => item.rewards)
      .reduce((acc, item) => acc + Number(item.claimableUsd), 0);

    const messageData = {
      tokenAAmount: formatOtherPrice(amount, { isKMB: false }),
    };

    broadcastLoading(getMessage(DexEvent.CLAIM_FEE, "pending", messageData));

    setLoadingTransactionClaim(true);
    claimAll({ rpcProvider }).then(response => {
      if (response) {
        if (response.code === 0 || response.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
          enqueueEvent({
            txHash: response?.data?.hash,
            action: DexEvent.CLAIM_FEE,
            visibleEmitResult: true,
            checkWugnotTransfer: true,
            formatData: () => {
              return messageData;
            },
            onUpdate: async () => {
              await refetchGrc20Balances();
              await updateBalances();
            },
            onEmit: async () => {
              await delay(5000);
              handleRefreshData();
            },
            onSuccess: handleRefreshData,
          });
        }

        if (response.code === 0) {
          broadcastSuccess(getMessage(DexEvent.CLAIM_FEE, "success", messageData, response?.data?.hash));
          setLoadingTransactionClaim(false);
          openModal();
        } else if (response.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
          broadcastRejected(getMessage(DexEvent.CLAIM_FEE, "error", messageData), () => {});
          setLoadingTransactionClaim(false);
          openModal();
        } else {
          openModal();
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
          setLoadingTransactionClaim(false);
        }
      }
    });
  };

  const handleSetIsClosePosition = () => {
    setIsShowClosedPosition(!isShowClosePosition);
  };

  const closedPosition = useMemo(() => {
    return (
      accountPositions
        .filter(item => item.closed)
        .sort((a, b) => {
          return Number(a.id ?? 0) - Number(b.id ?? 0);
        }) ?? []
    );
  }, [accountPositions]);

  const haveClosedPosition = useMemo(() => closedPosition.length > 0, [closedPosition.length]);
  const haveNotClosedPosition = useMemo(() => openedPosition.length > 0, [openedPosition.length]);

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
      address={address}
      isOwnerAddress={addressContext.isOwner}
      addressName={addressName}
      isOtherPosition={isOtherPosition}
      openedPosition={visiblePositions ? openedPosition : []}
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
      claim={claimReward}
      isStakable={isStakable}
      isShowRemovePositionButton={isShowRemovePositionButton}
      loading={isLoadingPosition}
      loadingTransactionClaim={loadingTransactionClaim}
      isShowClosePosition={isShowClosePosition}
      handleSetIsClosePosition={handleSetIsClosePosition}
      isHiddenAddPosition={!!((address && account?.address && address !== account?.address) || !account?.address)}
      showClosePositionButton={showClosePositionButton}
      tokenPrices={tokenPrices}
    />
  );
};

export default MyLiquidityContainer;
