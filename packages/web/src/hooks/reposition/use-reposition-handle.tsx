import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  DEFAULT_SLIPPAGE,
  RANGE_STATUS_OPTION,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType
} from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { useAddress } from "@hooks/address/use-address";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePositionData } from "@hooks/common/use-position-data";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useSelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useEstimateSwap } from "@query/router";
import {
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse
} from "@repositories/position/response";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse
} from "@repositories/swap/response/swap-route-response";
import { IncreaseState } from "@states/index";
import { checkGnotPath } from "@utils/common";
import { subscriptFormat } from "@utils/number-utils";
import { getRepositionAmountsByPriceRange, getRepositionAmountsWithSwapSimulation } from "@utils/reposition-utils";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import {
  priceToNearTick,
  tickToPrice
} from "@utils/swap-utils";

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
    feeTier: `FEE_${fee}` as SwapFeeTierType,
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

  const initialEstimatedRepositionAmounts = useMemo(() => {
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

    const repositionAmountsByNewPriceRange = getRepositionAmountsByPriceRange(
      ordered ? selectPool.currentPrice : 1 / selectPool.currentPrice,
      selectPool.minPrice,
      selectPool.maxPrice,
      tickToPrice(
        ordered ? selectedPosition.tickLower : selectedPosition.tickUpper * -1,
      ),
      tickToPrice(
        ordered ? selectedPosition.tickUpper : selectedPosition.tickLower * -1,
      ),
      selectedPosition.tokenABalance,
      selectedPosition.tokenBBalance,
    );

    return repositionAmountsByNewPriceRange;
  }, [
    selectPool.compareToken,
    selectPool.currentPrice,
    selectPool.maxPrice,
    selectPool.minPrice,
    selectedPosition,
    tokenA,
    tokenB,
  ]);

  const estimateSwapRequest = useMemo(() => {
    if (!currentAmounts || !initialEstimatedRepositionAmounts || !selectedPosition) {
      return null;
    }
    const { amountA, amountB } = currentAmounts;
    const { amountA: repositionAmountA, amountB: repositionAmountB } =
      initialEstimatedRepositionAmounts;

    const isSwapAtoB = BigNumber(amountA).isGreaterThan(repositionAmountA);
    if (isSwapAtoB) {
      return {
        inputToken: selectedPosition.pool.tokenA,
        outputToken: selectedPosition.pool.tokenB,
        tokenAmount: Number(amountA) - repositionAmountA || 0,
        exactType: "EXACT_IN" as const,
      };
    }
    return {
      inputToken: selectedPosition.pool.tokenB,
      outputToken: selectedPosition.pool.tokenA,
      tokenAmount: Number(amountB) - repositionAmountB || 0,
      exactType: "EXACT_IN" as const,
    };
  }, [currentAmounts, initialEstimatedRepositionAmounts, selectedPosition]);

  const {
    data: estimatedSwapResult,
    isLoading: isEstimatedRemainSwapLoading,
    isError: isErrorLiquidity,
  } = useEstimateSwap(estimateSwapRequest, {
    enabled: !!estimateSwapRequest && !!estimateSwapRequest.tokenAmount,
    refetchInterval: 10_000,
    staleTime: 10_000,
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
      selectPool.maxPrice === null
    ) {
      return null;
    }

    if (estimateSwapRequest?.tokenAmount === 0) {
      return {
        amountA: currentAmounts.amountA.toString(),
        amountB: currentAmounts.amountB.toString(),
      };
    }

    if (
      !estimateSwapRequest?.inputToken ||
      isEstimatedRemainSwapLoading ||
      !estimatedSwapResult
    ) {
      return null;
    }

    return getRepositionAmountsWithSwapSimulation(
      selectPool.currentPrice,
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
    selectPool.maxPrice,
    selectPool.minPrice,
    selectedPosition,
  ]);

  const isSkipSwap = useMemo(() => {
    if (estimateSwapRequest?.tokenAmount === 0) {
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
    estimateSwapRequest,
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
    if (!address || !estimatedSwapResult || !estimateSwapRequest) {
      return null;
    }

    const isSwapAtoB =
      estimateSwapRequest.inputToken === selectedPosition?.pool.tokenA;

    const inputAmount = isSwapAtoB
      ? BigNumber(currentAmounts?.amountA || 0).minus(
          BigNumber(estimatedRepositionAmounts?.amountA || 0),
        )
      : BigNumber(currentAmounts?.amountB || 0).minus(
          BigNumber(estimatedRepositionAmounts?.amountB || 0),
        );

    const outputAmount = isSwapAtoB
      ? BigNumber(estimatedRepositionAmounts?.amountB || 0).minus(
          BigNumber(currentAmounts?.amountB || 0),
        )
      : BigNumber(estimatedRepositionAmounts?.amountA || 0).minus(
          BigNumber(currentAmounts?.amountA || 0),
        );

    return swapRouterRepository
      .swapRoute({
        ...estimateSwapRequest,
        estimatedRoutes: estimatedSwapResult.estimatedRoutes,
        tokenAmount: inputAmount.toNumber(),
        tokenAmountLimit:
          outputAmount.toNumber() * ((100 - DEFAULT_SLIPPAGE) / 100),
      })
      .catch(() => null);
  }, [
    address,
    currentAmounts,
    estimateSwapRequest,
    estimatedRepositionAmounts,
    estimatedSwapResult,
    selectedPosition?.pool.tokenA,
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
        estimatedRepositionAmounts === null ||
        estimatedRepositionAmounts?.amountA === null ||
        estimatedRepositionAmounts?.amountB === null
      ) {
        return null;
      }

      const isSwappedAtoB =
        checkGnotPath(selectedPosition.pool.tokenB.path) ===
        checkGnotPath(swapToken?.path || "");

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

      return positionRepository
        .repositionLiquidity({
          lpTokenId: selectedPosition.lpTokenId,
          tokenA,
          tokenB,
          tokenAAmount,
          tokenBAmount,
          slippage: DEFAULT_SLIPPAGE,
          minTick: priceToNearTick(selectPool.minPrice, selectPool.tickSpacing),
          maxTick: priceToNearTick(selectPool.maxPrice, selectPool.tickSpacing),
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
      selectPool.tickSpacing,
      currentAmounts,
      estimatedRepositionAmounts,
      positionRepository,
      updateConfirmModalData,
      openConfirmModal,
      router,
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
