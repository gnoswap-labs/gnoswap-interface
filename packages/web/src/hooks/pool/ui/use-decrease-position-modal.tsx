import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { GNOT_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { RANGE_STATUS_OPTION, SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { useAddress } from "@hooks/common/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { QUERY_KEY } from "@query/query-keys";
import { DexEvent } from "@repositories/common";
import { CommonState } from "@states/index";
import { delay } from "@utils/common";
import { makeDisplayTokenAmount } from "@utils/token-utils";

import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { getGasUsed } from "@hooks/gas";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { makeDecreaseLiquidityMessagesWithApproves } from "@repositories/position/position.message";
import { DecreaseLiquidityRequest } from "@repositories/position/request";
import { makePoolPath } from "@utils/pool-utils";
import DecreasePositionModalContainer from "../../../layouts/pool/pool-decrease-liquidity/containers/decrease-position-modal-container/DecreasePositionModalContainer";
import { IPooledTokenInfo } from "../data/use-decrease-handle";

export interface Props {
  openModal: () => void;
}

export interface DecreasePositionModal {
  positionId: string;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  slippage: number;
  swapFeeTier: SwapFeeTierType | null;
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  calculatedLiquidity: string;
  pooledTokenInfos: IPooledTokenInfo | null;
  refetchPositions: () => Promise<void>;
}

export const useDecreasePositionModal = ({
  positionId,
  tokenA,
  slippage,
  tokenB,
  swapFeeTier,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  calculatedLiquidity,
  pooledTokenInfos,
}: DecreasePositionModal): Props => {
  const { walletClient, currentChainId } = useWallet();
  const router = useRouter();
  const { address } = useAddress();
  const clearModal = useClearModal();

  const { positionRepository, transactionService } = useGnoswapContext();
  const { estimateNetworkFee } = useNetworkFee(null);
  const { invalidateQueryKey } = useInvalidateQueries();

  const onSuccessClose = useCallback(() => {
    clearModal();
    router.back();
  }, [clearModal, router]);

  const { broadcastRejected, broadcastSuccess, broadcastLoading, broadcastError } = useBroadcastHandler();
  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal();
  const { enqueueEvent } = useTransactionEventStore();

  const poolPath = makePoolPath(tokenA, tokenB, swapFeeTier);

  // Refetch functions
  const { updateBalances } = useTokenData();

  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const handleRefreshData = useCallback(async () => {
    invalidateQueryKey("DecreasePosition", [
      [QUERY_KEY.pools],
      [QUERY_KEY.positions, currentChainId, address],
      [QUERY_KEY.poolDetail, poolPath],
      [QUERY_KEY.poolLiquidityTicks],
    ]);
  }, [invalidateQueryKey, poolPath, currentChainId, address]);

  const { getMessage } = useMessage();

  const tokenTransform = useCallback((token: TokenModel) => {
    if (token.path === GNOT_TOKEN.path) {
      return WUGNOT_TOKEN;
    }

    return token;
  }, []);

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    return {
      tokenA,
      tokenB,
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr,
    };
  }, [swapFeeTier, tokenA, tokenB]);

  const buildAdenaWalletAction = async (request: DecreaseLiquidityRequest) => {
    return await positionRepository.decreaseLiquidity(request).catch(() => null);
  };

  const buildSocialWalletAction = async (rpcProvider: GnoProvider | null, request: DecreaseLiquidityRequest) => {
    if (!rpcProvider) {
      console.log("DecreaseLiquidity: ", new CommonError("FAILED_INITIALIZE_GNO_PROVIDER"));
      return null;
    }

    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const txMessages = await makeDecreaseLiquidityMessagesWithApproves(request, getAllowance);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: DecreaseLiquidityRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: getGasUsed(currentGasInfo).toString(),
    };

    return await positionRepository.decreaseLiquidity(requestWithGasInfo).catch(() => null);
  };

  const decreaseLiquidity = useCallback(
    async ({ rpcProvider }: { rpcProvider: GnoProvider | null }) => {
      if (!address || !tokenA || !tokenB) {
        return false;
      }

      const deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString();

      const poolAmountA = BigNumber(pooledTokenInfos?.poolAmountA ?? 0).toNumber();
      const poolAmountB = BigNumber(pooledTokenInfos?.poolAmountB ?? 0).toNumber();

      const walletType = walletClient?.getWalletType();

      if (walletType === "ADENA") {
        broadcastLoading(
          getMessage(DexEvent.REMOVE, "pending", {
            tokenASymbol: tokenTransform(tokenA).symbol,
            tokenBSymbol: tokenTransform(tokenB).symbol,
            tokenAAmount: Number(pooledTokenInfos?.poolAmountA).toLocaleString("en-US", {
              maximumFractionDigits: tokenTransform(tokenA).decimals,
            }),
            tokenBAmount: Number(pooledTokenInfos?.poolAmountB).toLocaleString("en-US", {
              maximumFractionDigits: tokenTransform(tokenB).decimals,
            }),
          }),
        );
      }

      const defaultMessageData = {
        tokenASymbol: tokenTransform(tokenA).symbol,
        tokenBSymbol: tokenTransform(tokenB).symbol,
        tokenAAmount: Number(poolAmountA).toLocaleString("en-US", {
          maximumFractionDigits: tokenA.decimals,
        }),
        tokenBAmount: Number(poolAmountB).toLocaleString("en-US", {
          maximumFractionDigits: tokenB.decimals,
        }),
      };

      const request: DecreaseLiquidityRequest = {
        lpTokenId: positionId,
        calculatedLiquidity,
        tokenA,
        tokenB,
        tokenAAmount: poolAmountA,
        tokenBAmount: poolAmountB,
        slippage,
        caller: address,
        deadline,
      };

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
                return defaultMessageData;
              }
              return {
                ...defaultMessageData,
                tokenAAmount: Number(makeDisplayTokenAmount(tokenTransform(tokenA), response[4])).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: tokenTransform(tokenA).decimals,
                  },
                ),
                tokenBAmount: Number(makeDisplayTokenAmount(tokenTransform(tokenB), response[5])).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: tokenTransform(tokenB).decimals,
                  },
                ),
              };
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

        if (result.code === 0 && result?.data) {
          openTransactionConfirmModal();
          broadcastSuccess(
            getMessage(DexEvent.REMOVE, "success", defaultMessageData, result.data.hash),
            onSuccessClose,
          );
        } else if (
          result.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(getMessage(DexEvent.REMOVE, "error", defaultMessageData));
        } else {
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
        }
      }
      return true;
    },
    [
      address,
      tokenA,
      tokenB,
      pooledTokenInfos,
      walletClient,
      positionId,
      calculatedLiquidity,
      slippage,
      getMessage,
      tokenTransform,
      enqueueEvent,
      updateBalances,
      handleRefreshData,
      onSuccessClose,
      openTransactionConfirmModal,
      broadcastLoading,
      broadcastSuccess,
      broadcastRejected,
      broadcastError,
    ],
  );

  const openModal = useCallback(() => {
    if (!amountInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <DecreasePositionModalContainer
        amountInfo={amountInfo}
        minPriceStr={minPriceStr}
        maxPriceStr={maxPriceStr}
        rangeStatus={rangeStatus}
        calculateLiquidity={calculatedLiquidity}
        pooledTokenInfos={pooledTokenInfos}
        confirm={decreaseLiquidity}
      />,
    );
  }, [setModalContent, setOpenedModal, decreaseLiquidity, amountInfo, pooledTokenInfos]);

  return {
    openModal,
  };
};
