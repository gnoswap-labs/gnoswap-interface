import React from "react";

import { SwapFeeTierType } from "@constants/option.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useSlippage } from "@hooks/common/use-slippage";

import { useDecreaseHandle } from "@hooks/pool/data/use-decrease-handle";
import { useDecreasePositionModal } from "@hooks/pool/ui/use-decrease-position-modal";
import BigNumber from "bignumber.js";
import DecreaseLiquidity from "../../components/decrease-liquidity/DecreaseLiquidity";
import DecreaseLiquidityLoading from "../../components/decrease-liquidity/DecreaseLiquidityLoading";

const DecreaseLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const { slippage } = useSlippage();
  const positionId = router.getPositionId() || "";

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

  const calculatedLiquidity = React.useMemo(() => {
    if (!pooledTokenInfos?.liquidity) return "0";

    return BigNumber(pooledTokenInfos.liquidity)
      .multipliedBy(percent)
      .dividedBy(100)
      .integerValue(BigNumber.ROUND_DOWN)
      .toString();
  }, [pooledTokenInfos?.liquidity, percent]);

  const { openModal } = useDecreasePositionModal({
    positionId,
    tokenA,
    tokenB,
    slippage,
    swapFeeTier: `FEE_${fee}` as SwapFeeTierType,
    minPriceStr,
    maxPriceStr,
    rangeStatus,
    calculatedLiquidity,
    pooledTokenInfos,
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
    />
  );
};

export default DecreaseLiquidityContainer;
