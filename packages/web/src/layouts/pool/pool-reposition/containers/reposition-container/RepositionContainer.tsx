import React from "react";

import { PriceRangeMeta, SwapFeeTierType } from "@constants/option.constant";

import RepositionContent from "../../components/reposition-content/RepositionContent";
import { useRepositionHandle } from "@hooks/pool/data/use-reposition-handle";
import { useRepositionModalContainer } from "@hooks/pool/ui/use-reposition-position-modal";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

const PRICE_RANGES: PriceRangeMeta[] = [{ type: "Active" }, { type: "Passive" }, { type: "Custom" }];

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
    resetRange,
    selectedPosition,
    isLoadingPosition,
    isSkipSwap,
    refetchPositions,
  } = useRepositionHandle();
  const { rpcProvider } = useGnoswapContext();

  const { updateBalances } = useTokenData(true);

  const concentratedFeeApr =
    priceRangeSummary.feeBoost && priceRangeSummary.feeBoost !== "-"
      ? aprFee * Number(priceRangeSummary.feeBoost.replace("x", ""))
      : 0;

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
    aprFee: concentratedFeeApr,
    currentAmounts,
    repositionAmounts,
    removePosition: () => removePosition({ rpcProvider }),
    swapRemainToken: () => swapRemainToken({ rpcProvider }),
    reposition,
    isSkipSwap,
    refetchPositions: async () => {
      await refetchPositions();
      updateBalances();
    },
  });

  const onSubmit = () => {
    if (buttonType === "REPOSITION" || (buttonType === "LOADING" && isSkipSwap)) {
      openModal();
    }
  };

  return (
    <RepositionContent
      tokenA={tokenA}
      tokenB={tokenB}
      fee={`${Number(fee) / 10000}%`}
      rangeStatus={rangeStatus}
      aprFee={concentratedFeeApr}
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
      resetRange={resetRange}
      priceRange={priceRange}
      currentAmounts={currentAmounts}
      repositionAmounts={repositionAmounts}
      selectedPosition={selectedPosition}
      isLoadingPosition={isLoadingPosition}
      isSkipSwap={isSkipSwap}
    />
  );
};

export default RepositionContainer;
