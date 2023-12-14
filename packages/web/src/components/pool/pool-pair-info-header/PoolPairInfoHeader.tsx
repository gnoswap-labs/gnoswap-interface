import { IncentivizedOptions } from "@common/values";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import { PoolInfoHeaderWrapper } from "./PoolPairInfoHeader.styles";

interface PoolPairInfoHeaderProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  incentivizedType: IncentivizedOptions;
  rewardTokens: TokenModel[];
  feeStr: string;
}

const PoolPairInfoHeader: React.FC<PoolPairInfoHeaderProps> = ({
  tokenA,
  tokenB,
  feeStr,
  rewardTokens,
  incentivizedType
}) => {
  const incentivezedStr = useMemo(() => {
    if (incentivizedType === "INCENTIVIZED") {
      return "Incentivized";
    }
    if (incentivizedType === "EXTERNAL_INCENTIVIZED") {
      return "External-Incentivized";
    }
    return "Non-Incentivized";
  }, [incentivizedType]);

  const rewardTokenLogos = useMemo(() => {
    return rewardTokens.map(token => token.logoURI);
  }, [rewardTokens]);

  return (
    <PoolInfoHeaderWrapper>
      <div className="left-wrap">
        <DoubleLogo
          left={tokenA.logoURI}
          right={tokenB.logoURI}
        />
        <h3>
          {tokenA.symbol}/{tokenB.symbol}
        </h3>
      </div>
      <div className="badge-wrap">
        <div className="badge">{feeStr}</div>
        <div className="badge">
          {incentivezedStr}
          {rewardTokens.length > 0 && (
            <OverlapLogo
              size={18}
              logos={rewardTokenLogos}
            />
          )}
        </div>
      </div>
    </PoolInfoHeaderWrapper>
  );
};

export default PoolPairInfoHeader;
