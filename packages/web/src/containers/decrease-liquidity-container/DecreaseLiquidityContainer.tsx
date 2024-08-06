import React, { useState } from "react";

import DecreaseLiquidity from "@components/decrease/decrease-liquidity/DecreaseLiquidity";
import DecreaseLiquidityLoading from "@components/decrease/decrease-liquidity/DecreaseLiquidityLoading";
import useRouter from "@hooks/common/use-custom-router";
import { useSlippage } from "@hooks/common/use-slippage";
import { useDecreaseHandle } from "@hooks/decrease/use-decrease-handle";
import { useDecreasePositionModal } from "@hooks/decrease/use-decrease-position-modal";
import { SwapFeeTierType } from "@constants/option.constant";

const DecreaseLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const { slippage } = useSlippage();
  const positionId = router.getPositionId() || "";
  const [isWrap, setIsWrap] = useState(false);

  const {
    loading,
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
    positionId,
    tokenA,
    tokenB,
    slippage,
    swapFeeTier: `FEE_${fee}` as SwapFeeTierType,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
    percent,
    pooledTokenInfos,
    isWrap,
  });

  if (!tokenA || !tokenB || loading) return <DecreaseLiquidityLoading />;

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
      onSubmit={openModal}
      percent={percent}
      handlePercent={(value: number) => setPercent(value)}
      pooledTokenInfos={pooledTokenInfos}
      isWrap={isWrap}
      setIsWrap={() => setIsWrap(prev => !prev)}
    />
  );
};

export default DecreaseLiquidityContainer;
