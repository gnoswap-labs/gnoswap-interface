import IncreaseLiquidity from "@components/increase/increase-liquidity/IncreaseLiquidity";
import { PriceRangeType, SwapFeeTierPriceRange } from "@constants/option.constant";
import { useIncreaseHandle } from "@hooks/increase/use-increase-handle";
import { useIncreasePositionModal } from "@hooks/increase/use-increase-position-modal";
import React, { useEffect } from "react";

const IncreaseLiquidityContainer: React.FC = () => {
  const {
    tokenA,
    tokenB,
    fee,
    minPriceStr,
    maxPriceStr,
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
  } = useIncreaseHandle();

  const { openModal } = useIncreasePositionModal({
    tokenA,
    tokenB,
    tokenAAmountInput,
    tokenBAmountInput,
    swapFeeTier: `FEE_${fee}` as any,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
  });

  function initPriceRange(inputPriceRangeType?: PriceRangeType | null) {
    // if (inputPriceRangeType === "Custom") return;
    const currentPriceRangeType = inputPriceRangeType;
    const currentPrice = selectPool.isCreate
      ? selectPool.startPrice
      : selectPool.currentPrice;
    if (
      currentPrice &&
      selectPool.feeTier &&
      currentPriceRangeType &&
      !selectPool.isChangeMinMax
    ) {
      const priceRange =
        SwapFeeTierPriceRange[selectPool.feeTier][currentPriceRangeType];
      const minRateAmount = currentPrice * (priceRange.min / 100);
      const maxRateAmount = currentPrice * (priceRange.max / 100);
      selectPool.setMinPosition(currentPrice + minRateAmount);
      selectPool.setMaxPosition(currentPrice + maxRateAmount);
    } else if (selectPool.isChangeMinMax) {
      selectPool.setMinPosition(selectPool.minPrice);
      selectPool.setMaxPosition(selectPool.maxPrice);
    }
  }

  useEffect(() => {
    selectPool.resetRange();
    initPriceRange("Custom");
  }, [
    selectPool.poolPath,
    selectPool.feeTier,
    selectPool.startPrice,
  ]);

  const onSubmit = () => {
    openModal();
  };

  if (!tokenA || !tokenB) return null;

  return (
    <IncreaseLiquidity
      tokenA={tokenA}
      tokenB={tokenB}
      fee={`${Number(fee) / 10000}%`}
      minPriceStr={minPriceStr}
      maxPriceStr={maxPriceStr}
      rangeStatus={rangeStatus}
      aprFee={aprFee}
      priceRangeSummary={priceRangeSummary}
      connected={connected}
      tokenAAmountInput={tokenAAmountInput}
      tokenBAmountInput={tokenBAmountInput}
      changeTokenAAmount={changeTokenAAmount}
      changeTokenBAmount={changeTokenBAmount}
      slippage={slippage}
      changeSlippage={changeSlippage}
      buttonType={buttonType}
      onSubmit={onSubmit}
    />
  );
};

export default IncreaseLiquidityContainer;
