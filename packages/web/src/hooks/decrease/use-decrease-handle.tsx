import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { usePositionData } from "@hooks/common/use-position-data";
import { useSelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { IncreaseState } from "@states/index";
import { numberToUSD } from "@utils/number-utils";
import { isEndTickBy, tickToPriceStr } from "@utils/swap-utils";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import useRouter from "@hooks/common/use-custom-router";
import { useCallback, useMemo, useState, useEffect } from "react";

export interface IPriceRange {
  tokenARatioStr: string;
  tokenBRatioStr: string;
  feeBoost: string;
}

export interface IPooledTokenInfo {
  poolAmountA: string;
  poolAmountUSDA: string;
  poolAmountB: string;
  poolAmountUSDB: string;
  unClaimTokenAAmount: string;
  unClaimTokenBAmount: string;
  unClaimTokenAAmountUSD: string;
  unClaimTokenBAmountUSD: string;
  tokenABalance: string,
  tokenBBalance: string,
  tokenARemainingAmount: string,
  tokenBRemainingAmount: string,
}

export type DeCREASE_BUTTON_TYPE = "ENTER_AMOUNT" | "INCREASE_LIQUIDITY";

export const useDecreaseHandle = () => {
  const router = useRouter();
  const [selectedPosition, setSelectedPosition] = useAtom(
    IncreaseState.selectedPosition,
  );
  const poolPath = router.query["pool-path"] as string;
  const positionId = router.query["position-id"] as string;
  const { getGnotPath } = useGnotToGnot();
  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage | null>({
    type: "Custom",
  });
  const [percent, setPercent] = useState<number>(50);
  const { tokenPrices } = useTokenData();

  const { positions } = usePositionData();

  const loading = useMemo(() => {
    return !selectedPosition;
  }, [selectedPosition]);

  useEffect(() => {
    if (!selectedPosition && positions.length > 0 && positionId) {
      const position = positions.find(
        position => position.lpTokenId.toString() === positionId,
      );

      if (!position) {
        router.push(`/earn/pool/${poolPath}`);
        return;
      }

      setSelectedPosition(position);
    }
  }, [selectedPosition, positions, positionId, poolPath]);

  const { connected, account, loadingConnect } = useWallet();
  const minPriceStr = useMemo(() => {
    if (!selectedPosition) return "-";
    const isEndTick = isEndTickBy(
      selectedPosition?.tickLower,
      selectedPosition?.pool.fee,
    );
    const minPrice = tickToPriceStr(
      selectedPosition?.tickLower, {
      decimals: 40,
      isEnd: isEndTick
    });
    return `${minPrice}`;
  }, [selectedPosition?.tickUpper, selectedPosition?.tickLower]);

  const maxPriceStr = useMemo(() => {
    if (!selectedPosition) return "-";
    const isEndTick = isEndTickBy(
      selectedPosition?.tickUpper,
      selectedPosition?.pool.fee,
    );

    const maxPrice = tickToPriceStr(
      selectedPosition?.tickUpper, {
      decimals: 40,
      isEnd: isEndTick
    });

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
    if (
      !Number(tokenAAmountInput.amount) ||
      !Number(tokenBAmountInput.amount)
    ) {
      return "ENTER_AMOUNT";
    }
    return "INCREASE_LIQUIDITY";
  }, [tokenAAmountInput, tokenBAmountInput]);

  const changePriceRange = useCallback((priceRange: AddLiquidityPriceRage) => {
    setPriceRange(priceRange);
  }, []);

  const pooledTokenInfos: IPooledTokenInfo | null = useMemo(() => {
    if (!selectedPosition) {
      return null;
    }
    const tokenA = selectedPosition.pool.tokenA;
    const tokenB = selectedPosition.pool.tokenB;
    const pooledTokenAAmount = selectedPosition.tokenABalance;
    const pooledTokenBAmount = selectedPosition.tokenBBalance;
    const unClaimTokenA = selectedPosition.unclaimedFeeAAmount;
    console.log("🚀 ~ constpooledTokenInfos:IPooledTokenInfo|null=useMemo ~ unClaimTokenA:", unClaimTokenA);
    const unClaimTokenB = selectedPosition.unclaimedFeeBAmount;
    console.log("🚀 ~ constpooledTokenInfos:IPooledTokenInfo|null=useMemo ~ unClaimTokenB:", unClaimTokenB);

    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;

    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;
    const unClaimTokenAAmount = Number(unClaimTokenA) || 0;
    const unClaimTokenBAmount = Number(unClaimTokenB) || 0;
    return {
      poolAmountA: BigNumber(tokenAAmount)
        .multipliedBy(percent)
        .dividedBy(100)
        .toNumber()
        .toString(),
      poolAmountUSDA: numberToUSD(
        (tokenAAmount * Number(tokenAPrice) * percent) / 100,
      ),
      tokenABalance: tokenAAmount.toString(),
      tokenBBalance: tokenBAmount.toString(),
      tokenARemainingAmount: BigNumber(tokenAAmount)
        .multipliedBy(100 - percent)
        .dividedBy(100)
        .toNumber()
        .toString(),
      tokenBRemainingAmount: BigNumber(tokenBAmount)
        .multipliedBy(100 - percent)
        .dividedBy(100)
        .toNumber()
        .toString(),
      poolAmountB: BigNumber(tokenBAmount)
        .multipliedBy(percent)
        .dividedBy(100)
        .toNumber()
        .toString(),
      poolAmountUSDB: numberToUSD(
        (tokenBAmount * Number(tokenBPrice) * percent) / 100,
      ),
      unClaimTokenAAmount: BigNumber(unClaimTokenAAmount).toFormat(),
      unClaimTokenBAmount: BigNumber(unClaimTokenBAmount).toFormat(),
      unClaimTokenAAmountUSD: numberToUSD(
        unClaimTokenAAmount * Number(tokenAPrice),
      ),
      unClaimTokenBAmountUSD: numberToUSD(
        unClaimTokenBAmount * Number(tokenBPrice),
      ),
    };
  }, [selectedPosition, tokenPrices, percent]);

  useEffect(() => {
    if (!["done", "error", "failure"].includes(loadingConnect)) {
      return;
    }

    if (!account && poolPath) {
      router.push(`/earn/pool/${poolPath}`);
    }
  }, [account, poolPath, loadingConnect]);

  return {
    loading,
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
    pooledTokenInfos,
  };
};
