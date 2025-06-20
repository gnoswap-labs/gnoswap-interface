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

import StakePositionModal from "../../components/stake-position-modal/StakePositionModal";

interface StakePositionModalContainerProps {
  positions: PoolPositionModel[];
  refetchPositions: () => Promise<void>;
}

const StakePositionModalContainer = ({ positions, refetchPositions }: StakePositionModalContainerProps) => {
  const { account, walletClient } = useWallet();
  const { broadcastRejected, broadcastSuccess, broadcastLoading, broadcastError } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchPoolDetails } = useRefetchGetPoolDetailByPath(positions?.[0]?.poolPath);

  const { transactionService, positionRepository } = useGnoswapContext();
  const { estimateNetworkFee } = useNetworkFee(null);
  const router = useCustomRouter();
  const { getCurrentReferralAddress, removeReferrerFromLocalStorage } = useReferral();
  const clearModal = useClearModal();
  const { updateBalances, tokenPrices } = useTokenData();
  const poolPath = router.getPoolPath();
  const { data: pool } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });

  const { getMessage } = useMessage();

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();
    const pathName = router.pathname;
    if (pathName === "/earn/stake") {
      router.push("/earn");
    } else {
      router.push(router.asPath.replace("/stake", ""));
    }
  }, [clearModal, router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal({
    confirmCallback: onCloseConfirmTransactionModal,
  });

  const pooledTokenInfos = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce((accum, position) => accum + Number(position.tokenABalance), 0);
    const pooledTokenBAmount = positions.reduce((accum, position) => accum + Number(position.tokenBBalance), 0);
    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;
    return [
      {
        token: tokenA,
        amount: tokenAAmount,
      },
      {
        token: tokenB,
        amount: tokenBAmount,
      },
    ];
  }, [positions, tokenPrices]);

  const buildAdenaWalletAction = async (request: StakePositionsRequest) => {
    return await positionRepository.stakePositions(request).catch(() => null);
  };

  const buildSocialWalletAction = async (request: StakePositionsRequest) => {
    const txMessages = makeStakePositionsMessagesWithApproves(request);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: StakePositionsRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: currentGasInfo?.gasUsed.toString(),
    };

    return await positionRepository.stakePositions(requestWithGasInfo).catch(() => null);
  };

  const stakeOnSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const lpTokenIds = positions.map(position => position.id.toString());
    const tokenA = pooledTokenInfos?.[0];
    const tokenB = pooledTokenInfos?.[1];

    const walletType = walletClient?.getWalletType();
    const currentReferralAddress = getCurrentReferralAddress();

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
            onEmit: async () => {
              refetchPools();
              refetchPositions();
              refetchPoolDetails();
            },
            onUpdate: async () => {
              updateBalances();
            },
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
    pooledTokenInfos,
    getCurrentReferralAddress,
    broadcastLoading,
    broadcastSuccess,
    broadcastError,
    broadcastRejected,
    getMessage,
    openTransactionConfirmModal,
    updateBalances,
    refetchPositions,
    refetchPools,
    refetchPoolDetails,
    removeReferrerFromLocalStorage,
    enqueueEvent,
    router.pathname,
    router.asPath,
    clearModal,
  ]);

  return <StakePositionModal positions={positions} close={clearModal} onSubmit={stakeOnSubmit} pool={pool} />;
};

export default StakePositionModalContainer;
