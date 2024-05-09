import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { PoolModel } from "@models/pool/pool-model";
import { formatExchangeRate } from "@utils/number-utils";
import { useMemo } from "react";
import IconSwap from "../icons/IconSwap";
import MissingLogo from "../missing-logo/MissingLogo";
import { PairRatioWrapper } from "./PairRatio.styles";

interface PairRatioProps {
  loading?: boolean;
  onSwap?: (swap: boolean) => void;
  isSwap?: boolean;
  showSwapBtn?: boolean;
  pool: PoolModel;
}

export function PairRatio({
  loading = false,
  isSwap = false,
  onSwap,
  showSwapBtn,
  pool,
}: PairRatioProps) {
  const displayTokenSymbol = useMemo(
    () => (!isSwap ? pool.tokenA?.symbol : pool.tokenB?.symbol),
    [isSwap, pool.tokenA?.symbol, pool.tokenB?.symbol],
  );
  const secondTokenSymbol = useMemo(
    () => (isSwap ? pool.tokenA?.symbol : pool.tokenB?.symbol),
    [isSwap, pool.tokenA?.symbol, pool.tokenB?.symbol],
  );

  return (<PairRatioWrapper>
    {!loading && (
      <MissingLogo
        symbol={displayTokenSymbol}
        url={!isSwap ? pool.tokenA?.logoURI : pool.tokenB?.logoURI}
        width={20}
        className="image-logo"
      />
    )}
    {!loading && <div>1 {displayTokenSymbol} =&nbsp;{formatExchangeRate(pool.price)}&nbsp;{secondTokenSymbol}</div>}
    {showSwapBtn && !loading && (
      <div
        className="icon-wrapper"
        onClick={() => onSwap?.(!isSwap)}
      >
        <IconSwap />
      </div>
    )}
    {loading && (
      <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
        <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
      </SkeletonEarnDetailWrapper>
    )}
    {loading && (
      <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
        <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
      </SkeletonEarnDetailWrapper>
    )}
  </PairRatioWrapper>);
}

export default PairRatio;