import DecreaseLiquidity from "@components/decrease/decrease-liquidity/DecreaseLiquidity";
import DecreaseLiquidityLoading from "@components/decrease/decrease-liquidity/DecreaseLiquidityLoading";
import { useDecreaseHandle } from "@hooks/decrease/use-decrease-handle";
import { useDecreasePositionModal } from "@hooks/decrease/use-decrease-position-modal";
import useRouter from "@hooks/common/use-custom-router";
import React from "react";

const DecreaseLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const positionId =
    (Array.isArray(router.query["position-id"])
      ? router.query["position-id"][0]
      : router.query["position-id"]) || "";

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
    swapFeeTier: `FEE_${fee}` as any,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
    percent,
    pooledTokenInfos,
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
    />
  );
};

export default DecreaseLiquidityContainer;
