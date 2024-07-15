import RepositionContent from "@components/reposition/reposition-content/RepositionContent";
import { SwapFeeTierType } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { useRepositionHandle } from "@hooks/reposition/use-reposition-handle";
import { useRepositionModalContainer } from "@hooks/reposition/use-reposition-position-modal";
import React from "react";

const PRICE_RANGES: AddLiquidityPriceRage[] = [
  { type: "Active" },
  { type: "Passive" },
  { type: "Custom" },
];

const RepositionContainer: React.FC = () => {
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
    priceRange,
    changePriceRange,
    currentAmounts,
    repositionAmounts,
    removePosition,
    swapRemainToken,
    reposition,
    selectedPosition,
    isLoadingPosition,
  } = useRepositionHandle();

  const { openModal } = useRepositionModalContainer({
    tokenA,
    tokenB,
    tokenAAmountInput,
    tokenBAmountInput,
    swapFeeTier: `FEE_${fee}` as SwapFeeTierType,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
    priceRangeSummary,
    aprFee,
    currentAmounts,
    repositionAmounts,
    removePosition,
    swapRemainToken,
    reposition,
  });

  const onSubmit = () => {
    if (buttonType !== "REPOSITION") {
      return;
    }
    openModal();
  };

  return (
    <RepositionContent
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
      selectPool={selectPool}
      priceRanges={PRICE_RANGES}
      changePriceRange={changePriceRange}
      priceRange={priceRange}
      currentAmounts={currentAmounts}
      repositionAmounts={repositionAmounts}
      selectedPosition={selectedPosition}
      isLoadingPosition={isLoadingPosition}
    />
  );
};

export default RepositionContainer;
