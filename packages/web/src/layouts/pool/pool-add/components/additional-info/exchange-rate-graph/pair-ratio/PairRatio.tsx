import { useMemo } from "react";

import IconSwap from "@components/common/icons/IconSwap";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { PulseSkeletonWrapper } from "@components/common/pulse-skeleton/PulseSkeletonWrapper.style";
import { SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { PoolModel } from "@models/pool/pool-model";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

import { PairRatioWrapper } from "./PairRatio.styles";
import { DEVICE_TYPE } from "@styles/media";

function replaceGnotSymbol(symbol: string) {
  if (symbol === "WGNOT") return "GNOT";
  return symbol;
}

interface PairRatioProps {
  breakpoint: DEVICE_TYPE;
  loading?: boolean;
  onSwap?: (swap: boolean) => void;
  isSwap?: boolean;
  showSwapBtn?: boolean;
  pool: PoolModel;
  overrideValue?: number;
}

export function PairRatio({
  breakpoint,
  loading = false,
  isSwap = false,
  onSwap,
  showSwapBtn,
  pool,
  overrideValue,
}: PairRatioProps) {
  const displayTokenSymbol = useMemo(
    () => replaceGnotSymbol(!isSwap ? pool.tokenA?.displaySymbol : pool.tokenB?.displaySymbol),
    [isSwap, pool.tokenA?.displaySymbol, pool.tokenB?.displaySymbol],
  );
  const secondTokenSymbol = useMemo(
    () => replaceGnotSymbol(isSwap ? pool.tokenA?.displaySymbol : pool.tokenB?.displaySymbol),
    [isSwap, pool.tokenA?.displaySymbol, pool.tokenB?.displaySymbol],
  );

  function formatExchangeRate(value: number, options?: { feeTier?: SwapFeeTierType }) {
    const valueStr = value.toString();

    const range = options?.feeTier ? SwapFeeTierMaxPriceRangeMap[options?.feeTier] : null;

    const currentValue = Number(valueStr);

    if (!isNaN(currentValue) && range && currentValue / range.maxPrice > 0.9) {
      return "∞";
    }

    return formatTokenExchangeRate(Number(value).toString(), {
      maxSignificantDigits: 6,
      minLimit: 0.000001,
    });
  }

  return (
    <PairRatioWrapper>
      {!loading && (
        <MissingLogo
          symbol={replaceGnotSymbol(!isSwap ? pool.tokenA?.symbol : pool.tokenB?.symbol)}
          url={!isSwap ? pool.tokenA?.logoURI : pool.tokenB?.logoURI}
          width={20}
          className="image-logo"
        />
      )}
      {!loading && (
        <div className="ratio-value">
          {breakpoint !== DEVICE_TYPE.MOBILE && <>1 {displayTokenSymbol}</>} =&nbsp;
          {formatExchangeRate(overrideValue ?? pool.price)}&nbsp;
          {secondTokenSymbol}
        </div>
      )}
      {showSwapBtn && !loading && (
        <div className="icon-wrapper" onClick={() => onSwap?.(!isSwap)}>
          <IconSwap />
        </div>
      )}
      {loading && (
        <PulseSkeletonWrapper height={18} mobileHeight={18}>
          <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
        </PulseSkeletonWrapper>
      )}
      {loading && (
        <PulseSkeletonWrapper height={18} mobileHeight={18}>
          <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
        </PulseSkeletonWrapper>
      )}
    </PairRatioWrapper>
  );
}

export default PairRatio;
