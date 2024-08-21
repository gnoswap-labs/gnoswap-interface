import React, { useState } from "react";

import DecreaseLiquidity from "@views/pool/pool-decrease-liquidity/components/decrease-liquidity/DecreaseLiquidity";
import DecreaseLiquidityLoading from "@views/pool/pool-decrease-liquidity/components/decrease-liquidity/DecreaseLiquidityLoading";
import useRouter from "@hooks/common/use-custom-router";
import { useSlippage } from "@hooks/common/use-slippage";
import { useDecreaseHandle } from "@views/pool/pool-decrease-liquidity/hooks/use-decrease-handle";
import { useDecreasePositionModal } from "@views/pool/pool-decrease-liquidity/hooks/use-decrease-position-modal";
import { SwapFeeTierType } from "@constants/option.constant";

const DecreaseLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const { slippage } = useSlippage();
  const positionId = router.getPositionId() || "";
  const [isGetWGNOT, setIsGetWGNOT] = useState(false);

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
    isGetWGNOT,
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
      isGetWGNOT={isGetWGNOT}
      setIsGetWGNOT={() => setIsGetWGNOT(prev => !prev)}
    />
  );
};

export default DecreaseLiquidityContainer;
