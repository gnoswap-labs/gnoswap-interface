import { useMemo, useCallback, useState, useEffect } from "react";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
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
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { SwapRouteResponse } from "@repositories/swap/response/swap-route-response";
import { IncreaseState } from "@states/index";
import { MAX_UINT64 } from "@utils/math.utils";
import {
  getDepositAmountsByAmountA,
  priceToNearTick,
  tickToPrice,
} from "@utils/swap-utils";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import useRouter from "@hooks/common/use-custom-router";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { convertToKMB } from "@utils/stake-position-utils";
import { checkGnotPath, encryptId } from "@utils/common";
import { useEstimateSwap } from "@query/router";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { RepositionLiquidityResponse } from "@repositories/position/response";

export interface IPriceRange {
  tokenARatioStr: string;
  tokenBRatioStr: string;
  feeBoost: string;
}

export type INCREASE_BUTTON_TYPE = "ENTER_AMOUNT" | "INCREASE_LIQUIDITY";

export const useRepositionHandle = () => {
  const router = useRouter();
  const poolPath = router.query["pool-path"] as string;
  const positionId = router.query["position-id"] as string;

  const [selectedPosition, setSelectedPosition] = useAtom(
    IncreaseState.selectedPosition,
  );

  const { address } = useAddress();
  const { swapRouterRepository, positionRepository } = useGnoswapContext();
  const { getGnotPath } = useGnotToGnot();
  const { slippage, changeSlippage } = useSlippage();
  const { connected, account } = useWallet();
  const { positions } = usePositionData({
    poolPath: encryptId(poolPath),
  });
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
  }, [selectedPosition?.pool]);

  const tokenB: TokenModel | null = useMemo(() => {
    if (!selectedPosition) return null;
    return {
      ...selectedPosition?.pool.tokenB,
      name: getGnotPath(selectedPosition?.pool.tokenB).name,
      symbol: getGnotPath(selectedPosition?.pool.tokenB).symbol,
      logoURI: getGnotPath(selectedPosition?.pool.tokenB).logoURI,
    };
  }, [selectedPosition?.pool]);

  const inRange = useMemo(() => {
    if (!selectedPosition) return false;
    const { tickLower, tickUpper, pool } = selectedPosition;
    const currentTick = pool.currentTick;
    if (currentTick < tickLower || currentTick > tickUpper) {
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

  const minPriceStr = useMemo(() => {
    if (!selectPool.minPrice) return "-";
    return convertToKMB(selectPool.minPrice.toString());
  }, [selectPool]);

  const maxPriceStr = useMemo(() => {
    if (!selectPool.maxPrice) return "-";
    return convertToKMB(selectPool.maxPrice.toString());
  }, [selectPool]);

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

  const buttonType: INCREASE_BUTTON_TYPE = useMemo(() => {
    if (
      !Number(tokenAAmountInput.amount) ||
      !Number(tokenBAmountInput.amount)
    ) {
      return "ENTER_AMOUNT";
    }
    return "INCREASE_LIQUIDITY";
  }, [tokenAAmountInput, tokenBAmountInput]);

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

    const compareDepositAmount = 100_000_000n;
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
        amountA: BigNumber(selectedPosition.tokenABalance)
          .multipliedBy(amountARatioBN)
          .toNumber(),
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

  const estimateSwapRequestByAmounts = useMemo(() => {
    if (!currentAmounts || !repositionAmounts || !selectedPosition) {
      return null;
    }

    const { amountA, amountB } = currentAmounts;
    const { amountA: repositionAmountA, amountB: repositionAmountB } =
      repositionAmounts;

    const isSwapTokenA = BigNumber(amountA).isGreaterThan(repositionAmountA);
    if (isSwapTokenA) {
      return {
        inputToken: selectedPosition.pool.tokenA,
        outputToken: selectedPosition.pool.tokenB,
        tokenAmount: amountA - repositionAmountA,
        exactType: "EXACT_IN" as const,
      };
    }
    return {
      inputToken: selectedPosition.pool.tokenB,
      outputToken: selectedPosition.pool.tokenA,
      tokenAmount: amountB - repositionAmountB,
      exactType: "EXACT_IN" as const,
    };
  }, [currentAmounts, repositionAmounts, selectedPosition]);

  const { data: estimatedRemainSwap, isLoading: isEstimatedRemainSwapLoading } =
    useEstimateSwap(estimateSwapRequestByAmounts, {
      enabled: !!estimateSwapRequestByAmounts,
    });

  const estimatedRepositionAmounts = useMemo(() => {
    if (!currentAmounts || !repositionAmounts || !selectedPosition) {
      return null;
    }

    const { amountA, amountB } = currentAmounts;
    const { amountA: repositionAmountA, amountB: repositionAmountB } =
      repositionAmounts;

    const isSwapTokenA = BigNumber(amountA).isGreaterThan(repositionAmountA);
    const isEstimated = !!estimatedRemainSwap && !isEstimatedRemainSwapLoading;
    const tokenA = selectedPosition.pool.tokenA;
    const tokenB = selectedPosition.pool.tokenB;

    const estimatedResult =
      makeDisplayTokenAmount(
        isSwapTokenA ? tokenB : tokenA,
        estimatedRemainSwap?.amount || 0,
      ) || 0;

    if (isSwapTokenA) {
      const estimatedAmountA = repositionAmountA;
      const estimatedAmountB = isEstimated ? estimatedResult + amountB : null;

      return {
        amountA: estimatedAmountA,
        amountB: estimatedAmountB,
      };
    }

    const estimatedAmountA = isEstimated ? estimatedResult + amountA : null;
    const estimatedAmountB = repositionAmountB;

    return {
      amountA: estimatedAmountA,
      amountB: estimatedAmountB,
    };
  }, [
    currentAmounts,
    estimatedRemainSwap,
    isEstimatedRemainSwapLoading,
    repositionAmounts,
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
        })
        .catch(() => null);
    }, [selectedPosition, positionRepository, address]);

  const swapRemainToken =
    useCallback(async (): Promise<WalletResponse<SwapRouteResponse> | null> => {
      if (!address || !estimatedRemainSwap || !estimateSwapRequestByAmounts) {
        return null;
      }

      return swapRouterRepository
        .swapRoute({
          ...estimateSwapRequestByAmounts,
          estimatedRoutes: estimatedRemainSwap.estimatedRoutes,
          tokenAmountLimit: Number(estimateSwapRequestByAmounts.tokenAmount),
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
      swapToken: TokenModel,
      swapAmount: string,
    ): Promise<WalletResponse<RepositionLiquidityResponse | null> | null> => {
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
        checkGnotPath(swapToken.path);
      const tokenAAmount = isSwappedTokenA
        ? BigNumber(currentAmounts.amountA).plus(swapAmount).toString()
        : repositionAmounts.amountA.toString();
      const tokenBAmount = isSwappedTokenA
        ? repositionAmounts.amountB.toString()
        : BigNumber(currentAmounts.amountB).plus(swapAmount).toString();

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
    if (!selectedPosition && positions.length > 0 && positionId) {
      const position = positions.filter(
        (_: PoolPositionModel) => _.id === positionId,
      )?.[0];
      if (position) {
        setSelectedPosition(position);
      } else {
        router.push(`/earn/pool/${poolPath}`);
      }
    }
  }, [selectedPosition, positions, positionId, poolPath]);

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
  };
};
