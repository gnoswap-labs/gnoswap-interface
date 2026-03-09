import { useCallback } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { DexEvent } from "@repositories/common";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { usePositionsRewards } from "@hooks/pool/data/use-positions-rewards";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useGetPoolList, useRefetchGetPoolDetailByPath } from "@query/pools";
import { makeUnStakePositionsMessagesWithApproves } from "@repositories/position/position.message";
import { UnstakePositionsRequest } from "@repositories/position/request";
import UnstakePositionModal from "../../components/unstake-position-modal/UnstakePositionModal";

interface UnstakePositionModalContainerProps {
  positions: PoolPositionModel[];
  isGetWGNOT: boolean;
  refetchPositions: () => Promise<void>;
}

const UnstakePositionModalContainer = ({
  positions,
  refetchPositions,
  isGetWGNOT,
}: UnstakePositionModalContainerProps) => {
  const { account, walletClient } = useWallet();
  const { transactionService, positionRepository } = useGnoswapContext();
  const { estimateNetworkFee } = useNetworkFee(null);

  const router = useRouter();
  const clearModal = useClearModal();
  const { broadcastRejected, broadcastSuccess, broadcastError, broadcastLoading } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { updateBalances } = useTokenData();
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchPoolDetails } = useRefetchGetPoolDetailByPath(positions?.[0]?.poolPath);

  const { pooledTokenInfos } = usePositionsRewards({ positions });
  const { openModal } = useTransactionConfirmModal({
    confirmCallback: () => router.push(router.asPath.replace("/unstake", "")),
  });

  const { getMessage } = useMessage();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const buildAdenaWalletAction = async (request: UnstakePositionsRequest) => {
    return await positionRepository.unstakePositions(request).catch(() => null);
  };

  const buildSocialWalletAction = async (rpcProvider: GnoProvider | null, request: UnstakePositionsRequest) => {
    if (!rpcProvider) {
      console.log("UnstakePosition: ", new CommonError("FAILED_INITIALIZE_GNO_PROVIDER"));
      return null;
    }

    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const txMessages = await makeUnStakePositionsMessagesWithApproves(request, getAllowance);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: UnstakePositionsRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: currentGasInfo?.gasUsed.toString(),
    };

    return await positionRepository.unstakePositions(requestWithGasInfo).catch(() => null);
  };

  const unstakeOnSubmit = useCallback(
    async ({ rpcProvider }: { rpcProvider: GnoProvider | null }) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      const tokenA = pooledTokenInfos?.[0];
      const tokenB = pooledTokenInfos?.[1];

      const walletType = walletClient?.getWalletType();

      const request: UnstakePositionsRequest = {
        positions,
        isGetWGNOT,
        caller: address,
      };

      if (walletType === "ADENA") {
        broadcastLoading(
          getMessage(DexEvent.UNSTAKE, "pending", {
            tokenASymbol: tokenA?.token?.symbol,
            tokenBSymbol: tokenB?.token?.symbol,
            tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
              decimals: tokenA?.token?.decimals,
              isKMB: false,
            }),
            tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
              decimals: tokenA?.token?.decimals,
              isKMB: false,
            }),
          }),
        );
      }

      try {
        const result = await (walletType === "ADENA"
          ? buildAdenaWalletAction(request)
          : buildSocialWalletAction(rpcProvider, request));

        if (result) {
          if (result.code === 0 || result.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
            enqueueEvent({
              txHash: result.data?.hash,
              action: DexEvent.UNSTAKE,
              visibleEmitResult: true,
              checkWugnotTransfer: true,
              formatData: () => ({
                tokenASymbol: tokenA?.token?.symbol,
                tokenBSymbol: tokenB?.token?.symbol,
                tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                  decimals: tokenA?.token?.decimals,
                  isKMB: false,
                }),
                tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
                  decimals: tokenA?.token?.decimals,
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
            setTimeout(() => {
              broadcastSuccess(
                getMessage(
                  DexEvent.UNSTAKE,
                  "success",
                  {
                    tokenASymbol: tokenA?.token?.symbol,
                    tokenBSymbol: tokenB?.token?.symbol,
                    tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                      decimals: tokenA?.token?.decimals,
                      isKMB: false,
                    }),
                    tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
                      decimals: tokenA?.token?.decimals,
                      isKMB: false,
                    }),
                  },
                  result.data?.hash,
                ),
              );
              openModal();
            }, 1000);
          } else if (result.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
            broadcastRejected(
              getMessage(DexEvent.UNSTAKE, "error", {
                tokenASymbol: tokenA?.token?.symbol,
                tokenBSymbol: tokenB?.token?.symbol,
                tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                  decimals: tokenA?.token?.decimals,
                  isKMB: false,
                }),
                tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
                  decimals: tokenA?.token?.decimals,
                  isKMB: false,
                }),
              }),
            );
            openModal();
          } else {
            broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
            openModal();
          }
        }
        return result;
      } catch (err) {
        console.log("UnStakePositions Error: ", err);
        broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
      }
    },
    [
      account?.address,
      pooledTokenInfos,
      walletClient,
      positions,
      isGetWGNOT,
      buildAdenaWalletAction,
      buildSocialWalletAction,
      broadcastLoading,
      broadcastSuccess,
      broadcastRejected,
      broadcastError,
      getMessage,
      enqueueEvent,
      refetchPools,
      refetchPositions,
      refetchPoolDetails,
      updateBalances,
      openModal,
    ],
  );

  return <UnstakePositionModal positions={positions} close={close} onSubmit={unstakeOnSubmit} />;
};

export default UnstakePositionModalContainer;
