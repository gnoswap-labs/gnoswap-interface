import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";

import { PoolInfoHeaderWrapper } from "./PoolPairInfoHeader.styles";

interface PoolPairInfoHeaderProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  incentivzed: boolean;
  rewardTokens: TokenModel[];
  feeStr: string;
}

const PoolPairInfoHeader: React.FC<PoolPairInfoHeaderProps> = ({
  tokenA,
  tokenB,
  feeStr,
  rewardTokens,
  incentivzed,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();
  const incentivezedStr = useMemo(() => {
    return incentivzed ? t("business:incentive") : "";
  }, [incentivzed, t]);

  const rewardTokenLogos = useMemo(() => {
    return rewardTokens.reduce((acc, current) => {
      const existToken = acc.some(item => item.path === getGnotPath(current).path);

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
            {rewardTokenLogos.length > 0 && <OverlapTokenLogo size={18} tokens={rewardTokenLogos} />}
          </div>
        )}
      </div>
    </PoolInfoHeaderWrapper>
  );
};

export default PoolPairInfoHeader;
