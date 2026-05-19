import React from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { formatDisplayTokenSymbol } from "@utils/token-utils";

import { usePositionsRewards } from "@hooks/pool/data/use-positions-rewards";

import { RemoveLiquiditySelectResultWrapper } from "./RemoveLiquiditySelectResult.styles";

interface RemoveLiquiditySelectResultProps {
  positions: PoolPositionModel[];
}

const RemoveLiquiditySelectResult: React.FC<RemoveLiquiditySelectResultProps> = ({ positions }) => {
  const { t } = useTranslation();

  const { pooledTokenInfos, unclaimedFees, totalLiquidityUSD } = usePositionsRewards({ positions });

  if (positions.length === 0) return <></>;

  return (
    <RemoveLiquiditySelectResultWrapper>
      <ul className="pooled-section">
        {pooledTokenInfos.map((pooledTokenInfo, index) => (
          <li key={index}>
            <div className="main-info">
              <MissingLogo
                symbol={pooledTokenInfo.token.symbol}
                url={pooledTokenInfo.token.logoURI}
                width={24}
                mobileWidth={24}
              />
              <p>
                {t("RemovePosition:overview.pooled")} {formatDisplayTokenSymbol(pooledTokenInfo.token.symbol)}
              </p>
              <strong>
                {formatPoolPairAmount(pooledTokenInfo.amount, {
                  decimals: pooledTokenInfo.token.decimals,
                })}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
        {unclaimedFees.map((pooledTokenInfo, index) => (
          <li key={index}>
            <div className="main-info">
              <MissingLogo
                symbol={pooledTokenInfo.token.symbol}
                url={pooledTokenInfo.token.logoURI}
                width={24}
                mobileWidth={24}
              />
              <p>{t("RemovePosition:overview.unclaimed")}</p>
              <strong>
                {formatPoolPairAmount(pooledTokenInfo.amount, {
                  decimals: pooledTokenInfo.token.decimals,
                })}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
      </ul>
      <div className="total-section">
        <h5>{t("RemovePosition:totalAmt")}</h5>
        <span className="total-value">{totalLiquidityUSD}</span>
      </div>
    </RemoveLiquiditySelectResultWrapper>
  );
};

export default RemoveLiquiditySelectResult;
