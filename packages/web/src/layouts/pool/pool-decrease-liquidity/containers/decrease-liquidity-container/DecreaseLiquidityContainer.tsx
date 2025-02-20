import React, { useState } from "react";

import { SwapFeeTierType } from "@constants/option.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useSlippage } from "@hooks/common/use-slippage";
import { GNOT_TOKEN } from "@common/values/token-constant";

import DecreaseLiquidity from "../../components/decrease-liquidity/DecreaseLiquidity";
import DecreaseLiquidityLoading from "../../components/decrease-liquidity/DecreaseLiquidityLoading";
import { useDecreaseHandle } from "@hooks/pool/data/use-decrease-handle";
import { useDecreasePositionModal } from "@hooks/pool/ui/use-decrease-position-modal";
import BigNumber from "bignumber.js";

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
    isGetWGNOT,
    refetchPositions: async () => {
      await refetchPositions();
    },
  });

  const showWGNOTToggle = React.useMemo(() => {
    if (!tokenA || !tokenB) return false;
    return tokenA.symbol === GNOT_TOKEN.symbol || tokenB.symbol === GNOT_TOKEN.symbol;
  }, [tokenA, tokenB]);

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
      showWGNOTToggle={showWGNOTToggle}
    />
  );
};

export default DecreaseLiquidityContainer;
