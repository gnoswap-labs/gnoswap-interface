import DecreaseLiquidity from "@components/decrease/decrease-liquidity/DecreaseLiquidity";
import { useDecreaseHandle } from "@hooks/decrease/use-decrease-handle";
import { useDecreasePositionModal } from "@hooks/decrease/use-decrease-position-modal";
import React from "react";

const DecreaseLiquidityContainer: React.FC = () => {
  const {
    tokenA,
    tokenB,
    fee,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
    aprFee,
    priceRangeSummary,
    percent,
    setPercent,
    pooledTokenInfos,
  } = useDecreaseHandle();

  const { openModal } = useDecreasePositionModal({
    tokenA,
    tokenB,
    swapFeeTier: `FEE_${fee}` as any,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
    percent,
    pooledTokenInfos,
  });

  const onSubmit = () => {
    openModal();
  };

  if (!tokenA || !tokenB) return null;

  return (
    <DecreaseLiquidity
      tokenA={tokenA}
      tokenB={tokenB}
      fee={`${Number(fee) / 10000}%`}
      minPriceStr={minPriceStr}
      maxPriceStr={maxPriceStr}
      rangeStatus={rangeStatus}
      aprFee={aprFee}
      priceRangeSummary={priceRangeSummary}
      onSubmit={onSubmit}
      percent={percent}
      handlePercent={(value: number) => setPercent(value)}
      pooledTokenInfos={pooledTokenInfos}
    />
  );
};

export default DecreaseLiquidityContainer;
