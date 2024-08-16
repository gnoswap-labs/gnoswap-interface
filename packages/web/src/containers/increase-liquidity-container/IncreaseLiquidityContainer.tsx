import React from "react";
import IncreaseLiquidity from "@components/increase/increase-liquidity/IncreaseLiquidity";
import { useIncreaseHandle } from "@hooks/increase/use-increase-handle";
import { useIncreasePositionModal } from "@hooks/increase/use-increase-position-modal";
import IncreaseLiquidityLoading from "@components/increase/increase-liquidity/IncreaseLiquidityLoading";
import { SwapFeeTierType } from "@constants/option.constant";

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
    isDepositTokenA,
    isDepositTokenB,
    loading,
  } = useIncreaseHandle();

  const { openModal } = useIncreasePositionModal({
    selectedPosition,
    tokenA,
    tokenB,
    tokenAAmountInput,
    tokenBAmountInput,
    slippage,
    swapFeeTier: `FEE_${fee}` as SwapFeeTierType,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
    isDepositTokenA,
    isDepositTokenB,
  });

  if (!tokenA || !tokenB || loading) return <IncreaseLiquidityLoading />;

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
      onSubmit={openModal}
    />
  );
};

export default IncreaseLiquidityContainer;
