import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import { PoolInfoHeaderWrapper } from "./PoolPairInfoHeader.styles";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { INCENTIVE_TYPE } from "@constants/option.constant";

interface PoolPairInfoHeaderProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  incentivizedType: INCENTIVE_TYPE;
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
  const { getGnotPath } = useGnotToGnot();
  const incentivezedStr = useMemo(() => {
    if (incentivizedType === "INCENTIVIZED") {
      return "Incentive";
    }
    if (incentivizedType === "EXTERNAL") {
      return "Incentive";
    }
    return "";
  }, [incentivizedType]);

  const rewardTokenLogos = useMemo(() => {
    const temp = rewardTokens.map(token => getGnotPath(token).logoURI);
    return temp;
  }, [rewardTokens]);

  return (
    <PoolInfoHeaderWrapper>
      <div className="left-wrap">
        <DoubleLogo
          left={tokenA.logoURI}
          right={tokenB.logoURI}
          leftSymbol={tokenA.symbol}
          rightSymbol={tokenB.symbol}
        />
        <h3>
          {tokenA.symbol}/{tokenB.symbol}
        </h3>
      </div>
      <div className="badge-wrap">
        <div className="badge">{feeStr}</div>
        {incentivezedStr && <div className="badge">
          {incentivezedStr}
          {rewardTokenLogos.length > 0 && (
            <OverlapLogo
              size={18}
              logos={rewardTokenLogos}
            />
          )}
        </div>}
      </div>
    </PoolInfoHeaderWrapper>
  );
};

export default PoolPairInfoHeader;
