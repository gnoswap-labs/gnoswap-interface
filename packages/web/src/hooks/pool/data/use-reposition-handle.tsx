import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { ERROR_VALUE } from "@common/errors/adena";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { ERROR_VALUE as SWAP_ERROR_VALUE } from "@common/errors/swap";
import {
  DEFAULT_SLIPPAGE,
  PriceRangeMeta,
  RANGE_STATUS_OPTION,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { useAddress } from "@hooks/common/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { useMessage } from "@hooks/common/use-message";
import { useReferral } from "@hooks/common/use-referral";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useSelectPool } from "@hooks/pool/data/use-select-pool";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/data/use-token-amount-input";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { QUERY_KEY } from "@query/query-keys";
import { useGetRoutes } from "@query/router";
import { DexEvent } from "@repositories/common";
import { RemoveLiquidityRequest, RepositionLiquidityRequest } from "@repositories/position/request";
import { RepositionLiquidityFailedResponse, RepositionLiquiditySuccessResponse } from "@repositories/position/response";
import { SwapRouteRequest } from "@repositories/swap-router/request/swap-route-request";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse,
} from "@repositories/swap-router/response/swap-route-response";
import { IncreaseState } from "@states/index";
import { checkGnotPath, delay } from "@utils/common";
import { subscriptFormat } from "@utils/number-utils";
import { makeDisplayPrice } from "@utils/pool-utils";
import {
  getRepositionAmountsByPriceRange,
  getRepositionAmountsWithSwapSimulation,
  makeRepositionSwapAmounts,
  makeRepositionSwapEstimateRequest,
} from "@utils/reposition-utils";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { priceToNearTick, tickToPrice } from "@utils/swap-utils";
import { makeDisplayTokenAmount, makeDisplayTokenAmountString } from "@utils/token-utils";

export interface IPriceRange {
  tokenARatioStr: string;
  tokenBRatioStr: string;
  feeBoost: string;
}

export type REPOSITION_BUTTON_TYPE = "REPOSITION" | "LOADING" | "NON_SELECTED_RANGE" | "INSUFFICIENT_LIQUIDITY";

export const useRepositionHandle = () => {
  const router = useRouter();
  const { getNextReferralAddress } = useReferral();
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const { broadcastError, broadcastSuccess, broadcastRejected } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  const [defaultPosition] = useAtom(IncreaseState.selectedPosition);
  const { getMessage } = useMessage();

  const { address } = useAddress();
  const { updateBalances } = useTokenData(true);
  const { swapRouterRepository, positionRepository } = useGnoswapContext();
  const { getGnotPath } = useGnotToGnot();
  const { slippage, changeSlippage } = useSlippage();
  const { connected, account, walletClient } = useWallet();
  const [initialized, setInitialized] = useState(false);
  const { positions, loading: isLoadingPosition, refetch: refetchPositions } = usePositionData({
    poolPath,
  });
  const { invalidateQueryKey } = useInvalidateQueries();

  const selectedPosition = useMemo(() => positions.find(item => item.id.toString() === positionId) || defaultPosition, [
    defaultPosition,
    positionId,
    positions,
  ]);

  const calculatedLiquidity = useMemo(() => {
    if (!selectedPosition?.liquidity) return BigNumber(0);

    return BigNumber(selectedPosition.liquidity.toString());
  }, [selectedPosition?.liquidity]);

  const defaultPositionMinPrice = useMemo(() => {
    if (!selectedPosition) {
      return null;
    }
    return tickToPrice(selectedPosition.tickLower);
  }, [selectedPosition]);

  const defaultPositionMaxPrice = useMemo(() => {
    if (!selectedPosition) {
      return null;
    }
    return tickToPrice(selectedPosition.tickUpper);
  }, [selectedPosition]);

  const { openModal: openConfirmModal } = useTransactionConfirmModal();

  const [priceRange, setPriceRange] = useState<PriceRangeMeta>({
    type: "Custom",
  });

  const fee = poolPath?.split(":")[2];

  const tokenA: TokenModel | null = useMemo(() => {
    if (!selectedPosition) return null;
    return {
      ...selectedPosition?.pool.tokenA,
      name: getGnotPath(selectedPosition?.pool.tokenA).name,
      symbol: getGnotPath(selectedPosition?.pool.tokenA).symbol,
      displaySymbol: getGnotPath(selectedPosition?.pool.tokenA).displaySymbol,
      logoURI: getGnotPath(selectedPosition?.pool.tokenA).logoURI,
    };
  }, [getGnotPath, selectedPosition]);

  const tokenB: TokenModel | null = useMemo(() => {
    if (!selectedPosition) return null;
    return {
      ...selectedPosition?.pool.tokenB,
      name: getGnotPath(selectedPosition?.pool.tokenB).name,
      symbol: getGnotPath(selectedPosition?.pool.tokenB).symbol,
      displaySymbol: getGnotPath(selectedPosition?.pool.tokenB).displaySymbol,
      logoURI: getGnotPath(selectedPosition?.pool.tokenB).logoURI,
    };
  }, [getGnotPath, selectedPosition]);

  const aprFee = useMemo(() => {
    if (!selectedPosition) return 0;
    return selectedPosition?.rewards.reduce((acc, item) => acc + Number(item.apr || 0), 0);
  }, [selectedPosition]);

  const selectPool = useSelectPool({
    tokenA,
    tokenB,
    feeTier: `FEE_${fee}` as SwapFeeTierType,
  });

  const sqrtPriceX96 = useMemo(() => {
    return selectPool?.sqrtPriceX96 ?? null;
  }, [selectPool]);

  const inRange = useMemo(() => {
    if (!selectedPosition) return false;
    const { pool } = selectedPosition;
    const currentPrice = tickToPrice(pool.currentTick);
    if (currentPrice < (selectPool.minPrice || 0) || currentPrice > (selectPool.maxPrice || 0)) {
      return false;
    }
    return true;
  }, [selectPool.maxPrice, selectPool.minPrice, selectedPosition]);

  const rangeStatus = useMemo(() => {
    return selectedPosition?.closed
      ? RANGE_STATUS_OPTION.NONE
      : inRange
      ? RANGE_STATUS_OPTION.IN
      : RANGE_STATUS_OPTION.OUT;
  }, [selectedPosition, inRange]);

  const resetRange = useCallback(() => {
    selectPool.resetRange();
    selectPool.setMinPosition(defaultPositionMinPrice);
    selectPool.setMaxPosition(defaultPositionMaxPrice);
  }, [defaultPositionMaxPrice, defaultPositionMinPrice, selectPool]);

  const handleRefreshData = useCallback(async () => {
    invalidateQueryKey("Reposition", [
      [QUERY_KEY.pools],
      [QUERY_KEY.positions],
      [QUERY_KEY.poolDetail],
      [QUERY_KEY.poolLiquidityTicks],
    ]);
  }, [invalidateQueryKey]);

  useEffect(() => {
    if (initialized || selectPool.isLoading || !selectPool.poolPath) {
      return;
    }
    if (!defaultPositionMinPrice || !defaultPositionMaxPrice) {
      return;
    }
    setInitialized(true);
    selectPool.setMinPosition(defaultPositionMinPrice);
    selectPool.setMaxPosition(defaultPositionMaxPrice);
  }, [defaultPositionMaxPrice, defaultPositionMinPrice, initialized, selectPool]);

  const formatPriceDisplay = useCallback(
    (price: number | string | BigNumber | null) => {
      if (price === null || BigNumber(Number(price)).isNaN() || !selectPool.feeTier || !tokenA || !tokenB) {
        return "-";
      }

      const isTokenABase = selectPool.compareToken?.path === tokenA.path;
      const baseToken = isTokenABase ? tokenA : tokenB;
      const quoteToken = isTokenABase ? tokenB : tokenA;

      const { maxPrice } = SwapFeeTierMaxPriceRangeMap[selectPool.feeTier || "NONE"];

      const displayPrice = BigNumber(makeDisplayPrice(price.toString(), baseToken, quoteToken));
      const currentValue = displayPrice.toNumber();
      const maxPriceWithRatio = BigNumber(maxPrice)
        .shiftedBy(baseToken.decimals - quoteToken.decimals)
        .toNumber();

      if (currentValue < 1 && currentValue !== 0) {
        return subscriptFormat(displayPrice.toFixed());
      }

      if (currentValue / maxPriceWithRatio > 0.9) {
        return "∞";
      }

      return formatTokenExchangeRate(displayPrice.toFixed(), {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      });
    },
    [selectPool.compareToken?.path, selectPool.feeTier, tokenA, tokenB],
  );

  const minPriceStr = useMemo(() => {
    return formatPriceDisplay(selectPool.minPrice);
  }, [formatPriceDisplay, selectPool.minPrice]);

  const maxPriceStr = useMemo(() => {
    return formatPriceDisplay(selectPool.maxPrice);
  }, [formatPriceDisplay, selectPool.maxPrice]);

  const priceRangeSummary: IPriceRange = useMemo(() => {
    let tokenARatioStr = "-";
    let tokenBRatioStr = "-";
    let feeBoost: string | null = null;
    const depositRatio = selectPool.depositRatio;
    if (depositRatio !== null) {
      tokenARatioStr = BigNumber(depositRatio).toFixed(1);
      tokenBRatioStr = BigNumber(100 - depositRatio).toFixed(1);
    }
    feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    return {
      tokenARatioStr,
      tokenBRatioStr,
      feeBoost,
    };
  }, [selectPool.depositRatio, selectPool.feeBoost]);

  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);

  const currentAmounts = useMemo(() => {
    if (!selectedPosition) {
      return null;
    }

    return {
      amountA: makeDisplayTokenAmountString(selectedPosition.pool.tokenA, selectedPosition.tokenABalance) ?? "0",
      amountB: makeDisplayTokenAmountString(selectedPosition.pool.tokenB, selectedPosition.tokenBBalance) ?? "0",
    };
  }, [selectedPosition]);

  const initialEstimatedRepositionAmounts = useMemo(() => {
    if (
      !selectedPosition ||
      !selectPool.minPrice ||
      !selectPool.maxPrice ||
      !sqrtPriceX96 ||
      !selectPool.compareToken ||
      !tokenA ||
      !tokenB
    ) {
      return null;
    }
    const ordered = checkGnotPath(selectPool.compareToken.path) === checkGnotPath(tokenA.path);

    const repositionAmountsByNewPriceRange = getRepositionAmountsByPriceRange(
      ordered ? selectPool.currentPrice : 1 / selectPool.currentPrice,
      sqrtPriceX96,
      selectPool.minPrice,
      selectPool.maxPrice,
      tickToPrice(ordered ? selectedPosition.tickLower : selectedPosition.tickUpper * -1),
      tickToPrice(ordered ? selectedPosition.tickUpper : selectedPosition.tickLower * -1),
      makeDisplayTokenAmountString(tokenA, selectedPosition.tokenABalance) ?? "0",
      makeDisplayTokenAmountString(tokenB, selectedPosition.tokenBBalance) ?? "0",
    );

    return repositionAmountsByNewPriceRange;
  }, [
    selectPool.compareToken,
    selectPool.currentPrice,
    selectPool.maxPrice,
    selectPool.minPrice,
    selectedPosition,
    sqrtPriceX96,
    tokenA,
    tokenB,
  ]);

  const estimateSwapRequest = useMemo(() => {
    if (!currentAmounts || !initialEstimatedRepositionAmounts || !selectedPosition) {
      return null;
    }
    return makeRepositionSwapEstimateRequest(
      selectedPosition.pool.tokenA,
      selectedPosition.pool.tokenB,
      currentAmounts,
      initialEstimatedRepositionAmounts,
    );
  }, [currentAmounts, initialEstimatedRepositionAmounts, selectedPosition]);

  const {
    data: estimatedSwapResult,
    isLoading: isEstimatedRemainSwapLoading,
    isError: isErrorLiquidity,
  } = useGetRoutes(estimateSwapRequest, {
    enabled: !!estimateSwapRequest && !!estimateSwapRequest.tokenAmount,
  });

  const buttonType: REPOSITION_BUTTON_TYPE = useMemo(() => {
    if (!initialEstimatedRepositionAmounts) {
      return "NON_SELECTED_RANGE";
    }
    if (isErrorLiquidity) {
      return "INSUFFICIENT_LIQUIDITY";
    }
    if (isEstimatedRemainSwapLoading) {
      return "LOADING";
    }
    return "REPOSITION";
  }, [initialEstimatedRepositionAmounts, isErrorLiquidity, isEstimatedRemainSwapLoading]);

  const estimatedRepositionAmounts = useMemo(() => {
    if (
      !currentAmounts ||
      !initialEstimatedRepositionAmounts ||
      !selectedPosition ||
      selectPool.minPrice === null ||
      selectPool.maxPrice === null ||
      !sqrtPriceX96
    ) {
      return null;
    }

    if (estimateSwapRequest?.tokenAmount === null) {
      return {
        amountA: currentAmounts.amountA.toString(),
        amountB: currentAmounts.amountB.toString(),
      };
    }

    if (!estimateSwapRequest?.inputToken || isEstimatedRemainSwapLoading || !estimatedSwapResult) {
      return null;
    }

    return getRepositionAmountsWithSwapSimulation(
      selectPool.currentPrice,
      sqrtPriceX96,
      selectPool.minPrice,
      selectPool.maxPrice,
      selectedPosition.pool.tokenA,
      selectedPosition.pool.tokenB,
      currentAmounts,
      initialEstimatedRepositionAmounts,
      estimateSwapRequest.inputToken,
      estimatedSwapResult.amount,
    );
  }, [
    currentAmounts,
    estimateSwapRequest,
    estimatedSwapResult,
    isEstimatedRemainSwapLoading,
    initialEstimatedRepositionAmounts,
    selectPool.currentPrice,
    sqrtPriceX96,
    selectPool.maxPrice,
    selectPool.minPrice,
    selectedPosition,
  ]);

  const isSkipSwap = useMemo(() => {
    if (estimateSwapRequest?.tokenAmount === null) {
      return true;
    }
    if (
      Number(currentAmounts?.amountA) === Number(estimatedRepositionAmounts?.amountA) &&
      Number(estimatedRepositionAmounts?.amountA) === 0
    ) {
      return true;
    }
    if (
      Number(currentAmounts?.amountB) === Number(estimatedRepositionAmounts?.amountB) &&
      Number(estimatedRepositionAmounts?.amountB) === 0
    ) {
      return true;
    }
    if (Number(currentAmounts?.amountA) === 0 && estimatedRepositionAmounts?.amountA === null) {
      return true;
    }
    if (Number(currentAmounts?.amountB) === 0 && estimatedRepositionAmounts?.amountB === null) {
      return true;
    }
    return false;
  }, [estimateSwapRequest, currentAmounts, estimatedRepositionAmounts]);

  const changeTokenAAmount = useCallback(
    (amount: string) => {
      tokenAAmountInput.changeAmount(amount);
    },
    [tokenAAmountInput],
  );

  const changeTokenBAmount = useCallback(
    (amount: string) => {
      tokenBAmountInput.changeAmount(amount);
    },
    [tokenBAmountInput],
  );

  const changePriceRange = useCallback(
    (priceRange: PriceRangeMeta) => {
      setPriceRange(priceRange);

      if (priceRange.type !== "Custom") {
        selectPool.setIsChangeMinMax(false);
        selectPool.setFullRange(false);
      }
    },
    [selectPool],
  );

  const buildAdenaWalletRemovePositionAction = useCallback(
    async (request: RemoveLiquidityRequest) => {
      return positionRepository.removeLiquidity(request).catch(() => null);
    },
    [positionRepository],
  );

  const removePosition = useCallback(async (): Promise<WalletResponse | null> => {
    if (!address || !selectedPosition) {
      return null;
    }

    const positionLiquidity = {
      [selectedPosition.lpTokenId]: calculatedLiquidity,
    };
    const approveTokenPath = [selectedPosition.pool.tokenA.path, selectedPosition.pool.tokenB.path];
    const deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString();

    const request: RemoveLiquidityRequest = {
      lpTokenIds: [selectedPosition.lpTokenId],
      positionLiquidities: positionLiquidity,
      tokenPaths: approveTokenPath,
      caller: address,
      deadline,
    };

    return await buildAdenaWalletRemovePositionAction(request);
  }, [address, buildAdenaWalletRemovePositionAction, calculatedLiquidity, selectedPosition]);

  const buildAdenaWalletExactInAction = useCallback(
    async (request: SwapRouteRequest) => {
      return swapRouterRepository.sendExactInSwapRoute(request);
    },
    [swapRouterRepository],
  );
  const buildAdenaWalletExactOutAction = useCallback(
    async (request: SwapRouteRequest) => {
      return swapRouterRepository.sendExactOutSwapRoute(request);
    },
    [swapRouterRepository],
  );

  const swapRemainToken = useCallback(async (): Promise<WalletResponse<
    SwapRouteSuccessResponse | SwapRouteFailedResponse
  > | null> => {
    if (!address || !estimatedSwapResult || !estimateSwapRequest) {
      return null;
    }

    const isSwapAtoB = estimateSwapRequest.inputToken === selectedPosition?.pool.tokenA;
    const isExactIn = estimateSwapRequest.exactType === "EXACT_IN";

    const deadline = Math.floor(Date.now() / 1000) + 300;
    const currentReferralAddress = getNextReferralAddress();

    // Amounts stay decimal strings end-to-end so values above Number.MAX_SAFE_INTEGER remain exact
    const swapAmounts = makeRepositionSwapAmounts(
      estimateSwapRequest,
      isSwapAtoB,
      currentAmounts ?? { amountA: "0", amountB: "0" },
      estimatedRepositionAmounts ?? { amountA: "0", amountB: "0" },
      DEFAULT_SLIPPAGE,
    );

    const request: SwapRouteRequest = {
      inputToken: estimateSwapRequest.inputToken,
      outputToken: estimateSwapRequest.outputToken,
      estimatedRoutes: estimatedSwapResult.estimatedRoutes,
      ...swapAmounts,
      slippage: slippage,
      originAmount: estimatedSwapResult.originAmount,
      deadline,
      referrerAddress: currentReferralAddress,
    };

    return await (isExactIn ? buildAdenaWalletExactInAction(request) : buildAdenaWalletExactOutAction(request)).catch(
      e => {
        if (e.status === SWAP_ERROR_VALUE.DRY_SWAP_DEVIATION_EXCEEDED.status) {
          broadcastError(BROADCAST_ERROR_VALUE.SLIPPAGE_EXCEEDED);
        } else {
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
        }
        return null;
      },
    );
  }, [
    address,
    estimateSwapRequest,
    estimatedSwapResult,
    estimatedRepositionAmounts,
    currentAmounts,
    selectedPosition?.pool.tokenA,
    buildAdenaWalletExactInAction,
    buildAdenaWalletExactOutAction,
    broadcastError,
    getNextReferralAddress,
    slippage,
  ]);

  const buildAdenaWalletRepositionAction = useCallback(
    async (request: RepositionLiquidityRequest) => {
      return positionRepository
        .repositionLiquidity(request)
        .then(async result => {
          const defaultMessageData = {
            tokenASymbol: request.tokenA.symbol,
            tokenBSymbol: request.tokenB.symbol,
            tokenAAmount: Number(request.tokenAAmount).toLocaleString("en-US", {
              maximumFractionDigits: request.tokenA.decimals,
            }),
            tokenBAmount: Number(request.tokenBAmount).toLocaleString("en-US", {
              maximumFractionDigits: request.tokenB.decimals,
            }),
          };

          if (result) {
            if (result.code === 0 || result.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
              enqueueEvent({
                txHash: result.data?.hash,
                action: DexEvent.REPOSITION,
                visibleEmitResult: true,
                checkWugnotTransfer: true,
                formatData: response => {
                  if (!response) {
                    return defaultMessageData;
                  }
                  return {
                    ...defaultMessageData,
                    tokenAAmount: Number(makeDisplayTokenAmount(request.tokenA, response[3])).toLocaleString("en-US", {
                      maximumFractionDigits: request.tokenA.decimals,
                    }),
                    tokenBAmount: Number(makeDisplayTokenAmount(request.tokenB, response[4])).toLocaleString("en-US", {
                      maximumFractionDigits: request.tokenB.decimals,
                    }),
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

            if (result.code === 0) {
              broadcastSuccess(
                getMessage(
                  DexEvent.REPOSITION,
                  "success",
                  {
                    tokenASymbol: request.tokenA.symbol || "",
                    tokenBSymbol: request.tokenB.symbol || "",
                    tokenAAmount: Number(request.tokenAAmount).toLocaleString("en-US", {
                      maximumFractionDigits: request.tokenA.decimals,
                    }),
                    tokenBAmount: Number(request.tokenBAmount).toLocaleString("en-US", {
                      maximumFractionDigits: request.tokenB.decimals,
                    }),
                  },
                  result.data?.hash,
                ),
                () => router.back(),
              );
              openConfirmModal();
            } else if (result.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
              broadcastRejected(
                getMessage(DexEvent.REPOSITION, "error", {
                  tokenASymbol: request.tokenA.symbol,
                  tokenBSymbol: request.tokenB.symbol,
                  tokenAAmount: Number(request.tokenAAmount).toLocaleString("en-US", {
                    maximumFractionDigits: request.tokenA.decimals,
                  }),
                  tokenBAmount: Number(request.tokenBAmount).toLocaleString("en-US", {
                    maximumFractionDigits: request.tokenB.decimals,
                  }),
                }),
              );
            } else {
              broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
            }
          }

          return result;
        })
        .catch(() => null);
    },
    [
      broadcastError,
      broadcastRejected,
      broadcastSuccess,
      enqueueEvent,
      getMessage,
      handleRefreshData,
      openConfirmModal,
      positionRepository,
      router,
      updateBalances,
    ],
  );

  const buildSocialWalletRepositionAction = useCallback(
    async (request: RepositionLiquidityRequest) => {
      return positionRepository
        .repositionLiquidity(request)
        .then(result => {
          if (result.code === 0) {
            broadcastSuccess({ title: "Reposition Complete", txHash: result.data?.hash }, () => router.back());
            openConfirmModal();
          }
          return result;
        })
        .catch(() => null);
    },
    [broadcastSuccess, openConfirmModal, positionRepository, router],
  );

  const reposition = useCallback(
    async (
      swapToken: TokenModel | null,
      swapAmount: string | null,
    ): Promise<WalletResponse<RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse> | null> => {
      if (
        !address ||
        !selectedPosition ||
        !tokenA ||
        !tokenB ||
        !selectPool.feeTier ||
        selectPool.minPrice === null ||
        selectPool.maxPrice === null ||
        currentAmounts === null ||
        estimatedRepositionAmounts === null ||
        estimatedRepositionAmounts?.amountA === null ||
        estimatedRepositionAmounts?.amountB === null
      ) {
        return null;
      }

      const isSwappedAtoB = checkGnotPath(selectedPosition.pool.tokenB.path) === checkGnotPath(swapToken?.path || "");

      let tokenAAmount = estimatedRepositionAmounts.amountA;
      let tokenBAmount = BigNumber.min(
        BigNumber(currentAmounts.amountB).plus(swapAmount || 0),
        estimatedRepositionAmounts.amountB,
      ).toString();

      if (!isSwappedAtoB) {
        tokenAAmount = BigNumber.min(
          BigNumber(currentAmounts.amountA).plus(swapAmount || 0),
          estimatedRepositionAmounts.amountA,
        ).toString();
        tokenBAmount = estimatedRepositionAmounts.amountB;
      }

      const walletType = walletClient?.getWalletType();

      const request: RepositionLiquidityRequest = {
        lpTokenId: selectedPosition.lpTokenId,
        tokenA,
        tokenB,
        tokenAAmount,
        tokenBAmount,
        slippage: DEFAULT_SLIPPAGE,
        minTick: priceToNearTick(selectPool.minPrice, selectPool.tickSpacing),
        maxTick: priceToNearTick(selectPool.maxPrice, selectPool.tickSpacing),
        caller: address,
      };

      return walletType === "ADENA"
        ? buildAdenaWalletRepositionAction(request)
        : buildSocialWalletRepositionAction(request);
    },
    [
      address,
      selectedPosition,
      tokenA,
      tokenB,
      selectPool.feeTier,
      selectPool.minPrice,
      selectPool.maxPrice,
      selectPool.tickSpacing,
      currentAmounts,
      estimatedRepositionAmounts,
      buildAdenaWalletRepositionAction,
      buildSocialWalletRepositionAction,
      walletClient,
    ],
  );

  useEffect(() => {
    if (!account && poolPath) {
      router.push(`/earn/pool/${poolPath}`);
    }
  }, [account, poolPath, router]);

  useEffect(() => {
    if (selectPool.isChangeMinMax) {
      setPriceRange({ type: "Custom" });
    }
  }, [selectPool.isChangeMinMax]);

  return {
    tokenA,
    tokenB,
    fee: fee,
    maxPriceStr,
    minPriceStr,
    rangeStatus,
    aprFee,
    priceRangeSummary,
    connected,
    tokenAAmountInput,
    tokenBAmountInput,
    isSkipSwap,
    changeTokenAAmount,
    changeTokenBAmount,
    slippage,
    changeSlippage,
    buttonType,
    selectPool,
    priceRange,
    changePriceRange,
    currentAmounts,
    repositionAmounts: estimatedRepositionAmounts,
    removePosition,
    swapRemainToken,
    reposition,
    resetRange,
    selectedPosition,
    isLoadingPosition,
    isErrorLiquidity,
    refetchPositions,
  };
};
