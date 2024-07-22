import { useMemo, useCallback, useState, useEffect } from "react";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
  SwapFeeTierMaxPriceRangeMap,
} from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { useAddress } from "@hooks/address/use-address";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePositionData } from "@hooks/common/use-position-data";
import { useSlippage } from "@hooks/common/use-slippage";
import { useSelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse,
} from "@repositories/swap/response/swap-route-response";
import { IncreaseState } from "@states/index";
import { MAX_UINT64 } from "@utils/math.utils";
import {
  getDepositAmountsByAmountA,
  getDepositAmountsByAmountB,
  priceToNearTick,
  tickToPrice,
} from "@utils/swap-utils";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import useRouter from "@hooks/common/use-custom-router";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { checkGnotPath } from "@utils/common";
import { useEstimateSwap } from "@query/router";
import { makeShiftAmount } from "@utils/token-utils";
import {
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "@repositories/position/response";
import { toShiftBitInt } from "@utils/number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { subscriptFormat } from "@utils/number-utils";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

export interface IPriceRange {
  tokenARatioStr: string;
  tokenBRatioStr: string;
  feeBoost: string;
}

export type REPOSITION_BUTTON_TYPE =
  | "REPOSITION"
  | "LOADING"
  | "NON_SELECTED_RANGE"
  | "INSUFFICIENT_LIQUIDITY";

const compareDepositAmount = 100_000_000n;

export const useRepositionHandle = () => {
  const router = useRouter();
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();

  const [defaultPosition] = useAtom(IncreaseState.selectedPosition);

  const { address } = useAddress();
  const { swapRouterRepository, positionRepository } = useGnoswapContext();
  const { getGnotPath } = useGnotToGnot();
  const { slippage, changeSlippage } = useSlippage();
  const { connected, account } = useWallet();
  const [initialized, setInitialized] = useState(false);
  const { positions, loading: isLoadingPosition } = usePositionData({
    poolPath,
  });

  const selectedPosition = useMemo(
    () =>
      positions.find(item => item.id.toString() === positionId) ||
      defaultPosition,
    [defaultPosition, positionId, positions],
  );

  const defaultPositionMinPrice = useMemo(() => {
    if (!selectedPosition) {
      return null;
    }
    return tickToPrice(selectedPosition.tickLower);
  }, [selectedPosition?.tickLower]);

  const defaultPositionMaxPrice = useMemo(() => {
    if (!selectedPosition) {
      return null;
    }
    return tickToPrice(selectedPosition.tickUpper);
  }, [selectedPosition?.tickUpper]);

  const { openModal: openConfirmModal, update: updateConfirmModalData } =
    useTransactionConfirmModal();

  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage>({
    type: "Custom",
  });

  const fee = poolPath?.split(":")[2];
  const tokenA: TokenModel | null = useMemo(() => {
    if (!selectedPosition) return null;
    return {
      ...selectedPosition?.pool.tokenA,
      name: getGnotPath(selectedPosition?.pool.tokenA).name,
      symbol: getGnotPath(selectedPosition?.pool.tokenA).symbol,
      logoURI: getGnotPath(selectedPosition?.pool.tokenA).logoURI,
    };
  }, [selectedPosition?.pool, selectedPosition]);

  const tokenB: TokenModel | null = useMemo(() => {
    if (!selectedPosition) return null;
    return {
      ...selectedPosition?.pool.tokenB,
      name: getGnotPath(selectedPosition?.pool.tokenB).name,
      symbol: getGnotPath(selectedPosition?.pool.tokenB).symbol,
      logoURI: getGnotPath(selectedPosition?.pool.tokenB).logoURI,
    };
  }, [selectedPosition?.pool, selectedPosition]);

  const aprFee = useMemo(() => {
    if (!selectedPosition) return 0;
    return selectedPosition?.reward.reduce(
      (acc, item) => acc + Number(item.apr || 0),
      0,
    );
  }, [selectedPosition]);

  const selectPool = useSelectPool({
    tokenA,
    tokenB,
    feeTier: `FEE_${fee}` as any,
  });

  const inRange = useMemo(() => {
    if (!selectedPosition) return false;
    const { pool } = selectedPosition;
    const currentPrice = tickToPrice(pool.currentTick);
    if (
      currentPrice < (selectPool.minPrice || 0) ||
      currentPrice > (selectPool.maxPrice || 0)
    ) {
      return false;
    }
    return true;
  }, [selectedPosition]);

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
  }, [selectPool]);

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
  }, [defaultPositionMinPrice, defaultPositionMaxPrice, selectPool.poolPath]);
  const formatPriceDisplay = useCallback(
    (price: number | string | BigNumber | null) => {
      if (
        price === null ||
        BigNumber(Number(price)).isNaN() ||
        !selectPool.feeTier
      ) {
        return "-";
      }

      const { maxPrice } =
        SwapFeeTierMaxPriceRangeMap[selectPool.feeTier || "NONE"];

      const currentValue = BigNumber(price).toNumber();

      if (currentValue < 1 && currentValue !== 0) {
        return subscriptFormat(BigNumber(price).toFixed());
      }

      if (currentValue / maxPrice > 0.9) {
        return "∞";
      }

      return formatTokenExchangeRate(Number(price), {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      });
    },
    [selectPool.feeTier],
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
      amountA: selectedPosition.tokenABalance,
      amountB: selectedPosition.tokenBBalance,
    };
  }, [selectedPosition]);

  const repositionAmounts = useMemo(() => {
    if (
      !selectedPosition ||
      !selectPool.minPrice ||
      !selectPool.maxPrice ||
      !selectPool.compareToken ||
      !tokenA ||
      !tokenB
    ) {
      return null;
    }
    const ordered =
      checkGnotPath(selectPool.compareToken.path) ===
      checkGnotPath(tokenA.path);

    const currentPrice = ordered
      ? selectPool.currentPrice
      : 1 / selectPool.currentPrice;
    const originPrices = ordered
      ? {
          minPrice: tickToPrice(selectedPosition.tickLower),
          maxPrice: tickToPrice(selectedPosition.tickUpper),
        }
      : {
          minPrice: tickToPrice(-1 * selectedPosition.tickUpper),
          maxPrice: tickToPrice(-1 * selectedPosition.tickLower),
        };
    const depositPrices = {
      minPrice: selectPool.minPrice,
      maxPrice: selectPool.maxPrice,
    };

    const originDepositAmounts = getDepositAmountsByAmountA(
      currentPrice,
      originPrices.minPrice,
      originPrices.maxPrice,
      compareDepositAmount,
    );
    const depositAmounts = getDepositAmountsByAmountA(
      currentPrice,
      depositPrices.minPrice,
      depositPrices.maxPrice,
      compareDepositAmount,
    );

    const originDepositRatioBN = BigNumber(
      originDepositAmounts.amountA.toString(),
    ).dividedBy(
      Number(originDepositAmounts.amountA.toString()) +
        Number(originDepositAmounts.amountB.toString()),
    );
    const currentDepositRatioBN = BigNumber(
      Number(depositAmounts.amountA),
    ).dividedBy(
      Number(depositAmounts.amountA) + Number(depositAmounts.amountB),
    );

    const amountARatioBN =
      currentDepositRatioBN.dividedBy(originDepositRatioBN);
    const amountBRatioBN = BigNumber(
      1 - currentDepositRatioBN.toNumber(),
    ).dividedBy(1 - originDepositRatioBN.toNumber());

    if (originDepositRatioBN.isEqualTo(1)) {
      return {
        amountA: Math.floor(
          BigNumber(selectedPosition.tokenABalance)
            .multipliedBy(amountARatioBN)
            .toNumber(),
        ),
        amountB: 0,
      };
    }

    if (ordered) {
      return {
        amountA: BigNumber(selectedPosition.tokenABalance)
          .multipliedBy(amountARatioBN)
          .toNumber(),
        amountB: BigNumber(selectedPosition.tokenBBalance)
          .multipliedBy(amountBRatioBN)
          .toNumber(),
      };
    }

    return {
      amountA: BigNumber(selectedPosition.tokenABalance)
        .multipliedBy(amountBRatioBN)
        .toNumber(),
      amountB: BigNumber(selectedPosition.tokenBBalance)
        .multipliedBy(amountARatioBN)
        .toNumber(),
    };
  }, [
    selectPool.compareToken,
    selectPool.currentPrice,
    selectPool.maxPrice,
    selectPool.minPrice,
    selectedPosition,
    tokenA,
    tokenB,
  ]);

  const swapAmount = useMemo(() => {
    if (!currentAmounts || !repositionAmounts) {
      return null;
    }
    const { amountA, amountB } = currentAmounts;
    const { amountA: repositionAmountA, amountB: repositionAmountB } =
      repositionAmounts;

    const isSwapTokenA = BigNumber(amountA).isGreaterThan(repositionAmountA);
    if (isSwapTokenA) {
      return Number(amountA) - repositionAmountA;
    }
    return Number(amountB) - repositionAmountB;
  }, [currentAmounts, repositionAmounts]);

  const estimateSwapRequestByAmounts = useMemo(() => {
    if (!currentAmounts || !repositionAmounts || !selectedPosition) {
      return null;
    }

    const { amountA } = currentAmounts;
    const { amountA: repositionAmountA } = repositionAmounts;

    const isSwapTokenA = BigNumber(amountA).isGreaterThan(repositionAmountA);
    if (isSwapTokenA) {
      return {
        inputToken: selectedPosition.pool.tokenA,
        outputToken: selectedPosition.pool.tokenB,
        tokenAmount: swapAmount || 0,
        exactType: "EXACT_IN" as const,
      };
    }
    return {
      inputToken: selectedPosition.pool.tokenB,
      outputToken: selectedPosition.pool.tokenA,
      tokenAmount: swapAmount || 0,
      exactType: "EXACT_IN" as const,
    };
  }, [currentAmounts, repositionAmounts, selectedPosition, swapAmount]);

  const {
    data: estimatedRemainSwap,
    isLoading: isEstimatedRemainSwapLoading,
    isError: isErrorLiquidity,
  } = useEstimateSwap(estimateSwapRequestByAmounts, {
    enabled: !!estimateSwapRequestByAmounts && !!swapAmount,
    refetchInterval: 10_000,
    staleTime: 10_000,
  });

  const buttonType: REPOSITION_BUTTON_TYPE = useMemo(() => {
    if (!repositionAmounts) {
      return "NON_SELECTED_RANGE";
    }
    if (isErrorLiquidity) {
      return "INSUFFICIENT_LIQUIDITY";
    }
    if (isEstimatedRemainSwapLoading) {
      return "LOADING";
    }
    return "REPOSITION";
  }, [repositionAmounts, isErrorLiquidity, isEstimatedRemainSwapLoading]);

  const estimatedRepositionAmounts = useMemo(() => {
    if (
      !currentAmounts ||
      !repositionAmounts ||
      !selectedPosition ||
      selectPool.minPrice === null ||
      selectPool.maxPrice === null
    ) {
      return null;
    }

    if (estimateSwapRequestByAmounts?.tokenAmount === 0) {
      return {
        amountA: currentAmounts.amountA.toString(),
        amountB: currentAmounts.amountB.toString(),
      };
    }

    const { amountA, amountB } = currentAmounts;
    const { amountA: repositionAmountA, amountB: repositionAmountB } =
      repositionAmounts;

    const isSwapTokenA = BigNumber(amountA).isGreaterThan(repositionAmountA);
    const isEstimated = !!estimatedRemainSwap && !isEstimatedRemainSwapLoading;
    const tokenA = selectedPosition.pool.tokenA;
    const tokenB = selectedPosition.pool.tokenB;

    if (isEstimatedRemainSwapLoading) {
      return null;
    }

    if (!isEstimated) {
      return null;
    }

    const estimatedResult =
      makeDisplayTokenAmount(
        isSwapTokenA ? tokenB : tokenA,
        estimatedRemainSwap?.amount || 0,
      ) || 0;

    if (isSwapTokenA) {
      const estimatedAmountA = repositionAmountA;
      const estimatedAmountB = isEstimated
        ? estimatedResult + Number(amountB)
        : null;

      if (estimatedAmountA === 0) {
        return {
          amountA: Number(estimatedAmountA).toString(),
          amountB: Number(estimatedAmountB).toString(),
        };
      }

      const isInsufficientQuantity =
        repositionAmountB > Number(estimatedResult + Number(amountB) || 0);

      if (isInsufficientQuantity) {
        const depositAmounts = getDepositAmountsByAmountB(
          selectPool.currentPrice,
          selectPool.minPrice || 1,
          selectPool.maxPrice || 1,
          toShiftBitInt(estimatedAmountB || 0, tokenB.decimals),
        );
        return {
          amountA: makeShiftAmount(
            depositAmounts.amountA,
            tokenA.decimals * -1,
          ).toString(),
          amountB: makeShiftAmount(
            depositAmounts.amountB,
            tokenB.decimals * -1,
          ).toString(),
        };
      }

      const depositAmounts = getDepositAmountsByAmountA(
        selectPool.currentPrice,
        selectPool.minPrice || 1,
        selectPool.maxPrice || 1,
        toShiftBitInt(estimatedAmountA, tokenA.decimals),
      );
      return {
        amountA: makeShiftAmount(
          depositAmounts.amountA,
          tokenA.decimals * -1,
        ).toString(),
        amountB: makeShiftAmount(
          depositAmounts.amountB,
          tokenB.decimals * -1,
        ).toString(),
      };
    }

    const estimatedAmountA = isEstimated
      ? estimatedResult + Number(amountA)
      : null;
    const estimatedAmountB = repositionAmountB;

    if (estimatedAmountB === 0) {
      return {
        amountA: Number(estimatedAmountA).toString(),
        amountB: Number(estimatedAmountB).toString(),
      };
    }

    const isInsufficientQuantity =
      repositionAmountA > estimatedResult + Number(amountA);

    if (isInsufficientQuantity) {
      const depositAmounts = getDepositAmountsByAmountA(
        selectPool.currentPrice,
        selectPool.minPrice || 1,
        selectPool.maxPrice || 1,
        toShiftBitInt(estimatedAmountA || 0, tokenA.decimals),
      );
      return {
        amountA: makeShiftAmount(
          depositAmounts.amountA,
          tokenA.decimals * -1,
        ).toString(),
        amountB: makeShiftAmount(
          depositAmounts.amountB,
          tokenB.decimals * -1,
        ).toString(),
      };
    }

    const depositAmounts = getDepositAmountsByAmountB(
      selectPool.currentPrice,
      selectPool.minPrice || 1,
      selectPool.maxPrice || 1,
      toShiftBitInt(estimatedAmountB || 0, tokenB.decimals),
    );

    return {
      amountA: makeShiftAmount(
        depositAmounts.amountA,
        tokenA.decimals * -1,
      ).toString(),
      amountB: makeShiftAmount(
        depositAmounts.amountB,
        tokenB.decimals * -1,
      ).toString(),
    };
  }, [
    currentAmounts,
    estimatedRemainSwap,
    isEstimatedRemainSwapLoading,
    repositionAmounts,
    selectedPosition,
  ]);

  const isSkipSwap = useMemo(() => {
    if (estimateSwapRequestByAmounts?.tokenAmount === 0) {
      return true;
    }
    if (
      Number(currentAmounts?.amountA) ===
        Number(estimatedRepositionAmounts?.amountA) &&
      Number(estimatedRepositionAmounts?.amountA) === 0
    ) {
      return true;
    }
    if (
      Number(currentAmounts?.amountB) ===
        Number(estimatedRepositionAmounts?.amountB) &&
      Number(estimatedRepositionAmounts?.amountB) === 0
    ) {
      return true;
    }
    if (
      Number(currentAmounts?.amountA) === 0 &&
      estimatedRepositionAmounts?.amountA === null
    ) {
      return true;
    }
    if (
      Number(currentAmounts?.amountB) === 0 &&
      estimatedRepositionAmounts?.amountB === null
    ) {
      return true;
    }
    return false;
  }, [
    estimateSwapRequestByAmounts,
    currentAmounts,
    estimatedRepositionAmounts,
  ]);

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
    (priceRange: AddLiquidityPriceRage) => {
      setPriceRange(priceRange);
      if (priceRange.type !== "Custom") {
        selectPool.setIsChangeMinMax(false);
      }
    },
    [selectPool],
  );

  const removePosition =
    useCallback(async (): Promise<WalletResponse | null> => {
      if (!address || !selectedPosition) {
        return null;
      }

      return positionRepository
        .removeLiquidity({
          lpTokenIds: [selectedPosition.lpTokenId],
          caller: address,
          tokenPaths: [
            selectedPosition.pool.tokenA.path,
            selectedPosition.pool.tokenB.path,
          ],
          existWrappedToken: true,
        })
        .catch(() => null);
    }, [selectedPosition, positionRepository, address]);

  const swapRemainToken = useCallback(async (): Promise<WalletResponse<
    SwapRouteSuccessResponse | SwapRouteFailedResponse
  > | null> => {
    if (!address || !estimatedRemainSwap || !estimateSwapRequestByAmounts) {
      return null;
    }

    return swapRouterRepository
      .swapRoute({
        ...estimateSwapRequestByAmounts,
        estimatedRoutes: estimatedRemainSwap.estimatedRoutes,
        tokenAmount: (estimateSwapRequestByAmounts.inputToken ===
        selectedPosition?.pool.tokenA
          ? BigNumber(currentAmounts?.amountA || 0).minus(
              BigNumber(estimatedRepositionAmounts?.amountA || 0),
            )
          : BigNumber(currentAmounts?.amountB || 0).minus(
              BigNumber(estimatedRepositionAmounts?.amountB || 0),
            )
        ).toNumber(),
        tokenAmountLimit:
          (estimateSwapRequestByAmounts.inputToken ===
          selectedPosition?.pool.tokenA
            ? BigNumber(estimatedRepositionAmounts?.amountB || 0).minus(
                BigNumber(currentAmounts?.amountB || 0),
              )
            : BigNumber(estimatedRepositionAmounts?.amountA || 0).minus(
                BigNumber(currentAmounts?.amountA || 0),
              )
          ).toNumber() * 0.995,
      })
      .catch(() => null);
  }, [
    address,
    estimateSwapRequestByAmounts,
    estimatedRemainSwap,
    swapRouterRepository,
  ]);

  const reposition = useCallback(
    async (
      swapToken: TokenModel | null,
      swapAmount: string | null,
    ): Promise<WalletResponse<
      RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse
    > | null> => {
      if (
        !address ||
        !selectedPosition ||
        !tokenA ||
        !tokenB ||
        !selectPool.feeTier ||
        selectPool.minPrice === null ||
        selectPool.maxPrice === null ||
        currentAmounts === null ||
        repositionAmounts === null ||
        repositionAmounts.amountA === null ||
        repositionAmounts.amountB === null
      ) {
        return null;
      }

      const isSwappedTokenA =
        checkGnotPath(selectedPosition.pool.tokenA.path) ===
        checkGnotPath(swapToken?.path || tokenA.path);
      const tokenAAmount = isSwappedTokenA
        ? BigNumber(currentAmounts.amountA)
            .plus(swapAmount || 0)
            .toString()
        : repositionAmounts.amountA.toString();
      const tokenBAmount = isSwappedTokenA
        ? repositionAmounts.amountB.toString()
        : BigNumber(currentAmounts.amountB)
            .plus(swapAmount || 0)
            .toString();

      return positionRepository
        .repositionLiquidity({
          lpTokenId: selectedPosition.lpTokenId,
          tokenA,
          tokenB,
          tokenAAmount,
          tokenBAmount,
          slippage: Number(MAX_UINT64),
          minTick: priceToNearTick(
            selectPool.minPrice,
            SwapFeeTierInfoMap[selectPool.feeTier].tickSpacing,
          ),
          maxTick: priceToNearTick(
            selectPool.maxPrice,
            SwapFeeTierInfoMap[selectPool.feeTier].tickSpacing,
          ),
          caller: address,
        })
        .then(result => {
          if (result.code === 0) {
            updateConfirmModalData("success", "Reposition Complete", "", () =>
              router.back(),
            );
            openConfirmModal();
          }
          return result;
        })
        .catch(() => null);
    },
    [
      address,
      selectedPosition,
      tokenA,
      tokenB,
      selectPool.feeTier,
      selectPool.minPrice,
      selectPool.maxPrice,
      repositionAmounts,
      positionRepository,
    ],
  );

  useEffect(() => {
    if (!account && poolPath) {
      router.push(`/earn/pool/${poolPath}`);
    }
  }, [account, poolPath]);

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
  };
};
