import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { RANGE_STATUS_OPTION, SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { useAddress } from "@hooks/common/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { TokenAmountInputModel } from "@hooks/token/data/use-token-amount-input";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { DexEvent } from "@repositories/common";
import { CommonState } from "@states/index";

import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { QUERY_KEY } from "@query/query-keys";
import { makeIncreaseLiquidityMessagesWithApproves } from "@repositories/position/position.message";
import { IncreaseLiquidityRequest } from "@repositories/position/request";
import { delay } from "@utils/common";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import IncreasePositionModalContainer from "../../../layouts/pool/pool-increase-liquidity/containers/increase-position-modal-container/IncreasePositionModalContainer";

export interface Props {
  openModal: () => void;
}

export interface IncreasePositionModal {
  selectedPosition: PoolPositionModel | null;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  slippage: number;
  swapFeeTier: SwapFeeTierType | null;
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  isDepositTokenA: boolean;
  isDepositTokenB: boolean;
  refetchPositions: () => Promise<void>;
}

export const useIncreasePositionModal = ({
  selectedPosition,
  tokenA,
  tokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  slippage,
  swapFeeTier,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  isDepositTokenA,
  isDepositTokenB,
}: IncreasePositionModal): Props => {
  const { walletClient, currentChainId } = useWallet();
  const { broadcastRejected, broadcastSuccess, broadcastLoading, broadcastError } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();
  const { estimateNetworkFee } = useNetworkFee(null);
  const { invalidateQueryKey } = useInvalidateQueries();

  const router = useRouter();
  const { positionRepository, transactionService } = useGnoswapContext();
  const { address } = useAddress();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const poolPath = selectedPosition?.poolPath || "";

  // Refetch functions
  const { updateBalances } = useTokenData();

  const handleRefreshData = useCallback(async () => {
    invalidateQueryKey("IncreasePosition", [
      [QUERY_KEY.pools],
      [QUERY_KEY.positions, currentChainId, address],
      [QUERY_KEY.poolDetail, poolPath],
      [QUERY_KEY.poolPairBins],
    ]);
  }, [invalidateQueryKey, poolPath, currentChainId, address]);

  const onCloseConfirmTransactionModal = useCallback(() => {
    router.back();
  }, [router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal({
    closeCallback: onCloseConfirmTransactionModal,
  });

  const { getMessage } = useMessage();

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    return {
      tokenA: {
        info: tokenA,
        amount: tokenAAmountInput.amount,
        usdPrice: tokenAAmountInput.usdValue,
      },
      tokenB: {
        info: tokenB,
        amount: tokenBAmountInput.amount,
        usdPrice: tokenBAmountInput.usdValue,
      },
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr,
    };
  }, [swapFeeTier, tokenA, tokenAAmountInput, tokenBAmountInput, tokenB]);

  const buildAdenaWalletAction = async (request: IncreaseLiquidityRequest) => {
    return await positionRepository.increaseLiquidity(request).catch(() => null);
  };

  const buildSocialWalletAction = async (rpcProvider: GnoProvider | null, request: IncreaseLiquidityRequest) => {
    if (!rpcProvider) {
      console.log("IncreaseLiquidity: ", new CommonError("FAILED_INITIALIZE_GNO_PROVIDER"));
      return null;
    }

    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const txMessages = await makeIncreaseLiquidityMessagesWithApproves(request, getAllowance);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: IncreaseLiquidityRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: currentGasInfo?.gasUsed.toString(),
    };

    return await positionRepository.increaseLiquidity(requestWithGasInfo).catch(() => null);
  };

  const increaseLiquidity = async ({ rpcProvider }: { rpcProvider: GnoProvider | null }) => {
    if (!address || !selectedPosition) {
      return false;
    }

    const tokenA = selectedPosition.pool.tokenA;
    const tokenB = selectedPosition.pool.tokenB;

    const walletType = walletClient?.getWalletType();

    if (walletType === "ADENA") {
      broadcastLoading(
        getMessage(DexEvent.ADD, "pending", {
          tokenASymbol: tokenA.symbol,
          tokenBSymbol: tokenB.symbol,
          tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString("en-US", {
            maximumFractionDigits: tokenA.decimals,
          }),
          tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString("en-US", {
            maximumFractionDigits: tokenB.decimals,
          }),
        }),
      );
    }

    const deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString();
    const request: IncreaseLiquidityRequest = {
      lpTokenId: selectedPosition.id.toString(),
      tokenA: tokenA,
      tokenB: tokenB,
      tokenAAmount: Number(tokenAAmountInput.amount),
      tokenBAmount: Number(tokenBAmountInput.amount),
      slippage: slippage,
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
          action: DexEvent.ADD,
          visibleEmitResult: true,
          formatData: response => {
            const tokenAAmount = response ? makeDisplayTokenAmount(tokenA, response[2]) : tokenAAmountInput.amount;
            const tokenBAmount = response ? makeDisplayTokenAmount(tokenB, response[3]) : tokenBAmountInput.amount;
            return {
              tokenASymbol: tokenA.symbol,
              tokenBSymbol: tokenB.symbol,
              tokenAAmount: Number(tokenAAmount).toLocaleString("en-US", {
                maximumFractionDigits: tokenA.decimals,
              }),
              tokenBAmount: Number(tokenBAmount).toLocaleString("en-US", {
                maximumFractionDigits: tokenB.decimals,
              }),
            };
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

      if (result.code === 0) {
        openTransactionConfirmModal();
        // Make display token amount
        const tokenAAmount = (makeDisplayTokenAmount(tokenA, tokenAAmountInput.amount) || 0).toLocaleString("en-US", {
          maximumFractionDigits: tokenA.decimals,
        });
        const tokenBAmount = (makeDisplayTokenAmount(tokenB, tokenBAmountInput.amount) || 0).toLocaleString("en-US", {
          maximumFractionDigits: tokenB.decimals,
        });

        broadcastSuccess(
          getMessage(
            DexEvent.ADD,
            "success",
            {
              tokenASymbol: tokenA.symbol,
              tokenBSymbol: tokenB.symbol,
              tokenAAmount,
              tokenBAmount,
            },
            result.data?.hash,
          ),
        );
      } else if (
        result.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
      ) {
        broadcastRejected(
          getMessage(DexEvent.ADD, "error", {
            tokenASymbol: tokenA.symbol,
            tokenBSymbol: tokenB.symbol,
            tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString("en-US", {
              maximumFractionDigits: tokenA.decimals,
            }),
            tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString("en-US", {
              maximumFractionDigits: tokenB.decimals,
            }),
          }),
        );
      } else {
        broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
      }
    }
    return true;
  };

  const openModal = useCallback(() => {
    if (!amountInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <IncreasePositionModalContainer
        amountInfo={amountInfo}
        minPriceStr={minPriceStr}
        maxPriceStr={maxPriceStr}
        rangeStatus={rangeStatus}
        isDepositTokenA={isDepositTokenA}
        isDepositTokenB={isDepositTokenB}
        confirm={increaseLiquidity}
      />,
    );
  }, [amountInfo, isDepositTokenA, isDepositTokenB, increaseLiquidity]);

  return {
    openModal,
  };
};
