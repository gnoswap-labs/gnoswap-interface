import React, { useEffect } from "react";
import IncreaseLiquidity from "@components/increase/increase-liquidity/IncreaseLiquidity";
import { useIncreaseHandle } from "@hooks/increase/use-increase-handle";
import { useIncreasePositionModal } from "@hooks/increase/use-increase-position-modal";

const IncreaseLiquidityContainer: React.FC = () => {
  const {
    selectedPosition,
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
    isDepositTokenA,
    isDepositTokenB,
  } = useIncreaseHandle();

  const { openModal } = useIncreasePositionModal({
    selectedPosition,
    tokenA,
    tokenB,
    tokenAAmountInput,
    tokenBAmountInput,
    swapFeeTier: `FEE_${fee}` as any,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
    isDepositTokenA,
    isDepositTokenB,
  });

  useEffect(() => {
    if (selectPool.feeTier && fee && minPriceStr && maxPriceStr) {
      selectPool.resetRange();
      selectPool.setMinPosition(Number(minPriceStr));
      selectPool.setMaxPosition(Number(maxPriceStr));
    }
  }, [fee, minPriceStr, maxPriceStr, selectPool.feeTier]);

  const onSubmit = () => {
    openModal();
  };

  if (!tokenA || !tokenB) return <></>;

  return (
    <IncreaseLiquidity
      tokenA={tokenA}
      tokenB={tokenB}
      isDepositTokenA={isDepositTokenA}
      isDepositTokenB={isDepositTokenB}
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
