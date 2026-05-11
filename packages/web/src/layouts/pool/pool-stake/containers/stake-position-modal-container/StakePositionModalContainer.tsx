import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useGetPoolDetailByPath, useGetPoolList, useRefetchGetPoolDetailByPath } from "@query/pools";
import { DexEvent } from "@repositories/common";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useReferral } from "@hooks/common/use-referral";
import { StakePositionsRequest } from "@repositories/position/request";
import { makeStakePositionsMessagesWithApproves } from "@repositories/position/position.message";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { useAddress } from "@hooks/common/use-address";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { getGasUsed } from "@hooks/gas";
import { QUERY_KEY } from "@query/query-keys";
import { delay } from "@utils/common";

import StakePositionModal from "../../components/stake-position-modal/StakePositionModal";

interface StakePositionModalContainerProps {
  positions: PoolPositionModel[];
  refetchPositions: () => Promise<void>;
}

const StakePositionModalContainer = ({ positions, refetchPositions }: StakePositionModalContainerProps) => {
  const router = useCustomRouter();
  const { account, walletClient, currentChainId } = useWallet();
  const { address } = useAddress();
  const { broadcastRejected, broadcastSuccess, broadcastLoading, broadcastError } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  const poolPath = router.getPoolPath();

  // Refetch functions
  const { invalidateQueryKey } = useInvalidateQueries();
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchPoolDetails } = useRefetchGetPoolDetailByPath(poolPath);

  const { transactionService, positionRepository } = useGnoswapContext();
  const { estimateNetworkFee } = useNetworkFee(null);

  const { getNextReferralAddress, removeReferrerFromLocalStorage } = useReferral();
  const clearModal = useClearModal();
  const { updateBalances } = useTokenData();
  const { data: pool } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });

  const { getMessage } = useMessage();

  const handleRefreshData = useCallback(async () => {
    invalidateQueryKey("StakePosition", [
      [QUERY_KEY.pools],
      [QUERY_KEY.positions, currentChainId, address],
      [QUERY_KEY.poolDetail, poolPath],
      [QUERY_KEY.poolPairBins],
    ]);
    await Promise.all([refetchPositions(), refetchPools(), refetchPoolDetails()]);
  }, [invalidateQueryKey, poolPath, currentChainId, address, refetchPoolDetails, refetchPools, refetchPositions]);

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();
    if (poolPath) {
      router.push(`/earn/pool?poolPath=${poolPath}`);
    }
  }, [clearModal, router, poolPath]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal({
    confirmCallback: onCloseConfirmTransactionModal,
  });

  // Group balances by token path across the selected positions. With same-pool
  // selection this collapses to the pool's tokenA/tokenB exactly as before;
  // with a mixed-pool selection it keeps the (symbol, amount) pairs consistent
  // instead of mislabeling sums under positions[0]'s tokens.
  const pooledTokenInfos = useMemo(() => {
    const grouped = new Map<string, { token: typeof positions[number]["pool"]["tokenA"]; amount: number }>();

    const add = (token: typeof positions[number]["pool"]["tokenA"], balance: string | number | null | undefined) => {
      if (!token?.path) return;
      const amount = Number(balance ?? 0);
      if (!Number.isFinite(amount) || amount === 0) return;

      const existing = grouped.get(token.path);
      if (existing) {
        existing.amount += amount;
      } else {
        grouped.set(token.path, { token, amount });
      }
    };

    for (const position of positions) {
      add(position.pool.tokenA, position.tokenABalance);
      add(position.pool.tokenB, position.tokenBBalance);
    }

    return Array.from(grouped.values());
  }, [positions]);

  const buildAdenaWalletAction = useCallback(async (request: StakePositionsRequest) => {
    return await positionRepository.stakePositions(request).catch(() => null);
  }, [positionRepository]);

  const buildSocialWalletAction = useCallback(async (request: StakePositionsRequest) => {
    const txMessages = makeStakePositionsMessagesWithApproves(request);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: StakePositionsRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: getGasUsed(currentGasInfo).toString(),
    };

    return await positionRepository.stakePositions(requestWithGasInfo).catch(() => null);
  }, [estimateNetworkFee, positionRepository, transactionService]);

  const stakeOnSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const lpTokenIds = positions.map(position => position.id.toString());
    const tokenA = pooledTokenInfos?.[0];
    const tokenB = pooledTokenInfos?.[1];

    const walletType = walletClient?.getWalletType();
    const currentReferralAddress = getNextReferralAddress();

    const request: StakePositionsRequest = {
      lpTokenIds: lpTokenIds,
      caller: address,
      referrerAddress: currentReferralAddress,
    };

    if (walletType === "ADENA") {
      broadcastLoading(
        getMessage(DexEvent.STAKE, "pending", {
          tokenASymbol: tokenA?.token?.symbol,
          tokenBSymbol: tokenB?.token?.symbol,
          tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
            decimals: tokenA?.token?.decimals,
            isKMB: false,
          }),
          tokenBAmount: formatPoolPairAmount(tokenB.amount, {
            decimals: tokenB?.token?.decimals,
            isKMB: false,
          }),
        }),
      );
    }

    try {
      const result = await (walletType === "ADENA"
        ? buildAdenaWalletAction(request)
        : buildSocialWalletAction(request));

      if (result) {
        if (result.code === 0 || result.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
          enqueueEvent({
            txHash: result.data?.hash,
            action: DexEvent.STAKE,
            visibleEmitResult: true,
            formatData: () => ({
              tokenASymbol: tokenA?.token?.symbol,
              tokenBSymbol: tokenB?.token?.symbol,
              tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                decimals: tokenA?.token?.decimals,
                isKMB: false,
              }),
              tokenBAmount: formatPoolPairAmount(tokenB.amount, {
                decimals: tokenB?.token?.decimals,
                isKMB: false,
              }),
            }),
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
        if (result.code === 0) {
          openTransactionConfirmModal();
          broadcastSuccess(
            getMessage(
              DexEvent.STAKE,
              "success",
              {
                tokenASymbol: tokenA?.token?.symbol,
                tokenBSymbol: tokenB?.token?.symbol,
                tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                  decimals: tokenA?.token?.decimals,
                  isKMB: false,
                }),
                tokenBAmount: formatPoolPairAmount(tokenB.amount, {
                  decimals: tokenB?.token?.decimals,
                  isKMB: false,
                }),
              },
              result.data?.hash,
            ),
          );
          removeReferrerFromLocalStorage();
        } else if (result.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
          broadcastRejected(
            getMessage(DexEvent.STAKE, "error", {
              tokenASymbol: tokenA?.token?.symbol,
              tokenBSymbol: tokenB?.token?.symbol,
              tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                decimals: tokenA?.token?.decimals,
                isKMB: false,
              }),
              tokenBAmount: formatPoolPairAmount(tokenB.amount, {
                decimals: tokenB?.token?.decimals,
                isKMB: false,
              }),
            }),
          );
        } else {
          openTransactionConfirmModal();
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
        }
      }
      return result;
    } catch (err) {
      console.log("StakePositions Error: ", err);
      broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
    }
  }, [
    walletClient,
    account?.address,
    buildAdenaWalletAction,
    buildSocialWalletAction,
    handleRefreshData,
    positions,
    pooledTokenInfos,
    getNextReferralAddress,
    broadcastLoading,
    broadcastSuccess,
    broadcastError,
    broadcastRejected,
    getMessage,
    openTransactionConfirmModal,
    updateBalances,
    removeReferrerFromLocalStorage,
    enqueueEvent,
  ]);

  return <StakePositionModal positions={positions} close={clearModal} onSubmit={stakeOnSubmit} pool={pool} />;
};

export default StakePositionModalContainer;
