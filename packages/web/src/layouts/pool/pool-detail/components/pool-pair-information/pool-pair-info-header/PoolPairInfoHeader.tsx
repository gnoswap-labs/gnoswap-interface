import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { RewardTokenModel } from "@models/position/reward-model";
import { getUniqueRewardTokensWithMultipleRewardTypes } from "@utils/token-utils";

import { PoolInfoHeaderWrapper } from "./PoolPairInfoHeader.styles";

interface PoolPairInfoHeaderProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  incentivzed: boolean;
  rewardTokens: RewardTokenModel[];
  isMobile: boolean;
  feeStr: string;
}

const PoolPairInfoHeader: React.FC<PoolPairInfoHeaderProps> = ({
  tokenA,
  tokenB,
  feeStr,
  rewardTokens,
  isMobile,
  incentivzed,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();
  const incentivezedStr = useMemo(() => {
    return incentivzed ? t("business:incentive") : "";
  }, [incentivzed, t]);

  const rewardTokenLogos = useMemo(() => {
    return getUniqueRewardTokensWithMultipleRewardTypes(rewardTokens, getGnotPath);
  }, [getGnotPath, rewardTokens]);

  const doubleLogoSize = useMemo(() => {
    return isMobile ? 24 : 36;
  }, [isMobile]);

  return (
    <PoolInfoHeaderWrapper>
      <div className="left-wrap">
        <DoubleLogo
          left={tokenA.logoURI}
          right={tokenB.logoURI}
          leftSymbol={tokenA.symbol}
          rightSymbol={tokenB.symbol}
          size={doubleLogoSize}
        />
        <h3>
          {tokenA.displaySymbol}/{tokenB.displaySymbol}
        </h3>
      </div>
      <div className="badge-wrap">
        <div className="badge">{feeStr}</div>
        {incentivezedStr && (
          <div className="badge">
            {incentivezedStr}
            {rewardTokenLogos.length > 0 && (
              <OverlapTokenLogo size={18} tokens={rewardTokenLogos} showRewardType={true} />
            )}
          </div>
        )}
      </div>
    </PoolInfoHeaderWrapper>
  );
};

export default PoolPairInfoHeader;
