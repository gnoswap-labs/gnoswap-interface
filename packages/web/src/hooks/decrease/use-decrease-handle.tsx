import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { useSelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { IncreaseState } from "@states/index";
import { isEndTickBy, tickToPriceStr } from "@utils/swap-utils";
import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

export interface IPriceRange {
  tokenARatioStr: string;
  tokenBRatioStr: string;
  feeBoost: string;
}

export type DeCREASE_BUTTON_TYPE =
  | "ENTER_AMOUNT"
  | "INCREASE_LIQUIDITY"

export const useDecreaseHandle = () => {
  const router = useRouter();
  const selectedPosition = useAtomValue(IncreaseState.selectedPosition);
  const poolPath = router.query["pool-path"] as string;
  const { getGnotPath } = useGnotToGnot();
  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage | null>({ type: "Custom" });
  const [percent, setPercent] = useState<number>(50);

  const { connected } = useWallet();
  const minPriceStr = useMemo(() => {
    if (!selectedPosition) return "-";
    const isEndTick = isEndTickBy(
      selectedPosition?.tickLower,
      selectedPosition?.pool.fee,
    );
    const minPrice = tickToPriceStr(selectedPosition?.tickLower, 40, isEndTick);
    return `${minPrice}`;
  }, [selectedPosition?.tickUpper, selectedPosition?.tickLower]);

  const maxPriceStr = useMemo(() => {
    if (!selectedPosition) return "-";
    const isEndTick = isEndTickBy(
      selectedPosition?.tickUpper,
      selectedPosition?.pool.fee,
    );

    const maxPrice = tickToPriceStr(selectedPosition?.tickUpper, 40, isEndTick);

    return maxPrice;
  }, [selectedPosition?.tickLower, selectedPosition?.tickUpper]);

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
    return selectedPosition?.status
      ? RANGE_STATUS_OPTION.NONE
      : inRange
      ? RANGE_STATUS_OPTION.IN
      : RANGE_STATUS_OPTION.OUT;
  }, [selectedPosition, inRange]);

  const aprFee = useMemo(() => {
    if (!selectedPosition) return 0;
    return selectedPosition?.rewards.reduce(
      (acc, item) => acc + Number(item.apr || 0),
      0,
    );
  }, [selectedPosition]);

  const selectPool = useSelectPool({
    tokenA,
    tokenB,
    feeTier: `FEE_${fee}` as any,
    startPrice: 1,
    isCreate: true,
  });
  const priceRangeSummary: IPriceRange = useMemo(() => {
    let tokenARatioStr = "-";
    let tokenBRatioStr = "-";
    let feeBoost: string | null = null;
    const deposiRatio = selectPool.depositRatio;
    if (deposiRatio !== null) {
      tokenARatioStr = BigNumber(deposiRatio).toFixed(1);
      tokenBRatioStr = BigNumber(100 - deposiRatio).toFixed(1);
    }
    feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    return {
      tokenARatioStr,
      tokenBRatioStr,
      feeBoost,
    };
  }, [
    selectPool.compareToken?.symbol,
    selectPool.depositRatio,
    selectPool.feeBoost,
    selectPool.selectedFullRange,
  ]);

  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);
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

  const buttonType: DeCREASE_BUTTON_TYPE = useMemo(() => {
    if (!Number(tokenAAmountInput.amount) || !Number(tokenBAmountInput.amount)) {
      return "ENTER_AMOUNT";
    }
    return "INCREASE_LIQUIDITY";
  }, [tokenAAmountInput, tokenBAmountInput]);

  const changePriceRange = useCallback((priceRange: AddLiquidityPriceRage) => {
    setPriceRange(priceRange);
  }, []);

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
    buttonType,
    selectPool,
    priceRange,
    changePriceRange,
    setPercent,
    percent,
  };
};
