import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { TokenModel } from "@models/token/token-model";
import { formatExchangeRate } from "@utils/number-utils";
import IconSwap from "../icons/IconSwap";
import MissingLogo from "../missing-logo/MissingLogo";
import { PairRatioWrapper } from "./PairRatio.styles";

interface PairRatioProps {
  loading?: boolean;
  onSwap?: (swap: boolean) => void;
  isSwap?: boolean;
  tokenA: TokenModel;
  tokenB: TokenModel;
  showSwapBtn?: boolean;
  feeTier: string;
}

export function PairRatio({
  loading = false,
  isSwap = false,
  onSwap,
  tokenA,
  tokenB,
  showSwapBtn,
}: PairRatioProps) {
  return (<PairRatioWrapper>
    {!loading && (
      <MissingLogo
        symbol={!isSwap ? tokenA?.symbol : tokenB?.symbol}
        url={!isSwap ? tokenA?.logoURI : tokenB?.logoURI}
        width={20}
        className="image-logo"
      />
    )}
    {!loading && <div>1 {tokenA.symbol} =&nbsp;{formatExchangeRate(1.123812783)}&nbsp;{tokenB.symbol}</div>}
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