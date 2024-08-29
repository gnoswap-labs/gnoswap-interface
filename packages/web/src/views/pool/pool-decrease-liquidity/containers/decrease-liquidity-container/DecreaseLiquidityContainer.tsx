import React, { useState } from "react";

import { SwapFeeTierType } from "@constants/option.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useSlippage } from "@hooks/common/use-slippage";

import DecreaseLiquidity from "../../components/decrease-liquidity/DecreaseLiquidity";
import DecreaseLiquidityLoading from "../../components/decrease-liquidity/DecreaseLiquidityLoading";
import { useDecreaseHandle } from "../../hooks/use-decrease-handle";
import { useDecreasePositionModal } from "../../hooks/use-decrease-position-modal";

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
    refetchPositions,
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
    refetchPositions: async () => {
      await refetchPositions();
    },
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
