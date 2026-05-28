import BigNumber from "bignumber.js";
import { useCallback } from "react";

import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { ERROR_VALUE } from "@common/errors/adena";
import { GNOT_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { useAddress } from "@hooks/common/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { useMessage } from "@hooks/common/use-message";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { useGetPoolList, useRefetchGetPoolDetailByPath } from "@query/pools";
import { QUERY_KEY } from "@query/query-keys";
import { DexEvent } from "@repositories/common";
import { makeRemoveLiquidityMessagesWithApproves } from "@repositories/position/position.message";
import { RemoveLiquidityRequest } from "@repositories/position/request";
import { checkGnotPath, delay } from "@utils/common";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { getGasUsed } from "@hooks/gas";
import { usePositionsRewards } from "@hooks/pool/data/use-positions-rewards";
import { useTokenData } from "@hooks/token/data/use-token-data";
import RemovePositionModal from "../../components/remove-position-modal/RemovePositionModal";

interface RemovePositionModalContainerProps {
  selectedPositions: PoolPositionModel[];
  allPosition: PoolPositionModel[];
  positionLiquidities: Record<string, BigNumber>;
  refetchPositions: () => Promise<void>;
}

const RemovePositionModalContainer = ({
  selectedPositions,
  allPosition,
  positionLiquidities,
  refetchPositions,
}: RemovePositionModalContainerProps) => {
  const { account, walletClient, currentChainId } = useWallet();
  const { address } = useAddress();
  const { transactionService, positionRepository } = useGnoswapContext();
  const { estimateNetworkFee } = useNetworkFee(null);
  const { invalidateQueryKey } = useInvalidateQueries();

  const router = useRouter();
  const clearModal = useClearModal();
  const { broadcastRejected, broadcastSuccess, broadcastLoading, broadcastError } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  const poolPath = selectedPositions?.[0]?.poolPath || "";

  // Refetch functions
  const { updateBalances } = useTokenData();
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchPoolDetails } = useRefetchGetPoolDetailByPath(selectedPositions?.[0]?.poolPath);
  const { pooledTokenInfos } = usePositionsRewards({
    positions: selectedPositions,
  });

  const handleRefreshData = useCallback(async () => {
    invalidateQueryKey("RemovePosition", [
      [QUERY_KEY.pools],
      [QUERY_KEY.positions, currentChainId, address],
      [QUERY_KEY.poolDetail, poolPath],
      [QUERY_KEY.poolPairBins],
      [QUERY_KEY.poolLiquidityTicks],
    ]);
  }, [invalidateQueryKey, poolPath, currentChainId, address]);

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();
    router.push(router.asPath.replace("/remove", ""));
  }, [clearModal, router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal({
    closeCallback: onCloseConfirmTransactionModal,
  });

  const { getMessage } = useMessage();

  const tokenTransform = useCallback((token: TokenModel) => {
    if (token.path === GNOT_TOKEN.path) {
      return WUGNOT_TOKEN;
    }

    return token;
  }, []);

  const buildAdenaWalletAction = async (request: RemoveLiquidityRequest) => {
    return await positionRepository.removeLiquidity(request).catch(() => null);
  };

  const buildSocialWalletAction = async (rpcProvider: GnoProvider | null, request: RemoveLiquidityRequest) => {
    if (!rpcProvider) {
      console.log("RemoveLiquidity: ", new CommonError("FAILED_INITIALIZE_GNO_PROVIDER"));
      return null;
    }

    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const txMessages = await makeRemoveLiquidityMessagesWithApproves(request, getAllowance);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: RemoveLiquidityRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: getGasUsed(currentGasInfo).toString(),
    };

    return await positionRepository.removeLiquidity(requestWithGasInfo).catch(() => null);
  };

  const removeOnSubmit = useCallback(
    async ({ rpcProvider }: { rpcProvider: GnoProvider | null }) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      const lpTokenIds = selectedPositions.map(position => position.id.toString());
      const approveTokenPaths = [
        ...new Set(
          selectedPositions.flatMap(position => [
            position.pool.tokenA.wrappedPath || checkGnotPath(position.pool.tokenA.path),
            position.pool.tokenB.wrappedPath || checkGnotPath(position.pool.tokenB.path),
          ]),
        ),
      ];

      const walletType = walletClient?.getWalletType();

      const request: RemoveLiquidityRequest = {
        lpTokenIds,
        positionLiquidities,
        tokenPaths: approveTokenPaths,
        caller: address,
      };

      const broadcastMessageData = {
        tokenASymbol: tokenTransform(pooledTokenInfos?.[0].token).symbol,
        tokenBSymbol: tokenTransform(pooledTokenInfos?.[1]?.token).symbol,
        tokenAAmount: formatPoolPairAmount(pooledTokenInfos?.[0]?.amount, {
          decimals: pooledTokenInfos?.[0].token.decimals,
          isKMB: false,
        }),

        tokenBAmount: formatPoolPairAmount(pooledTokenInfos?.[1]?.amount, {
          decimals: pooledTokenInfos?.[1].token.decimals,
          isKMB: false,
        }),
      };

      if (walletType === "ADENA") {
        broadcastLoading(getMessage(DexEvent.REMOVE, "pending", broadcastMessageData));
      }

      try {
        const result = await (walletType === "ADENA"
          ? buildAdenaWalletAction(request)
          : buildSocialWalletAction(rpcProvider, request));

        if (result) {
          if (result.code === 0 || result.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
            enqueueEvent({
              txHash: result.data?.hash,
              action: DexEvent.REMOVE,
              visibleEmitResult: true,
              checkWugnotTransfer: true,
              formatData: response => {
                if (!response) {
                  return broadcastMessageData;
                }
                return broadcastMessageData;
              },
              onUpdate: async () => {
                updateBalances();
              },
              onEmit: async () => {
                await delay(1000);
                handleRefreshData();
              },
              onSuccess: handleRefreshData,
            });
          }
          if (result.code === 0) {
            setTimeout(async () => {
              broadcastSuccess(getMessage(DexEvent.REMOVE, "success", { ...broadcastMessageData }, result.data?.hash));
              openTransactionConfirmModal();
            }, 1000);
          } else if (
            result.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
          ) {
            broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
            clearModal();
          } else {
            broadcastRejected(getMessage(DexEvent.REMOVE, "error", { ...broadcastMessageData }, result?.data?.hash));
          }
        }
        return result;
      } catch (err) {
        console.log("RemoveLiquidity Error: ", err);
        broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
      }
    },
    [
      account?.address,
      walletClient,
      selectedPositions,
      positionLiquidities,
      tokenTransform,
      pooledTokenInfos,
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
      openTransactionConfirmModal,
      buildAdenaWalletAction,
      buildSocialWalletAction,
      clearModal,
    ],
  );

  return (
    <RemovePositionModal
      selectedPositions={selectedPositions}
      allPositions={allPosition}
      close={clearModal}
      onSubmit={removeOnSubmit}
    />
  );
};

export default RemovePositionModalContainer;
