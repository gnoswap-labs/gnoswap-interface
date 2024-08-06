import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import { PoolInfoHeaderWrapper } from "./PoolPairInfoHeader.styles";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { INCENTIVE_TYPE } from "@constants/option.constant";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { useTranslation } from "react-i18next";

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
  incentivizedType,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();
  const incentivezedStr = useMemo(() => {
    if (incentivizedType === "INCENTIVIZED") {
      return t("business:incentive");
    }
    if (incentivizedType === "EXTERNAL") {
      return t("business:incentive");
    }
    return "";
  }, [incentivizedType, t]);

  const rewardTokenLogos = useMemo(() => {
    return rewardTokens.reduce((acc, current) => {
      const existToken = acc.some(
        item => item.path === getGnotPath(current).path,
      );

      if (!existToken) {
        acc.push({
          ...current,
          logoURI: getGnotPath(current).logoURI,
          symbol: getGnotPath(current).symbol,
          path: getGnotPath(current).path,
        });
      }

      return acc;
    }, [] as TokenModel[]);
  }, [getGnotPath, rewardTokens]);

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
        {incentivezedStr && (
          <div className="badge">
            {incentivezedStr}
            {rewardTokenLogos.length > 0 && (
              <OverlapTokenLogo size={18} tokens={rewardTokenLogos} />
            )}
          </div>
        )}
      </div>
    </PoolInfoHeaderWrapper>
  );
};

export default PoolPairInfoHeader;
