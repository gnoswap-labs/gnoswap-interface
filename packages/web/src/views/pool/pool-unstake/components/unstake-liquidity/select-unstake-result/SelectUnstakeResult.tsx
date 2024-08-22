import React from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Switch from "@components/common/switch/Switch";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import { usePositionsRewards } from "../../../../common/hooks/use-positions-rewards";

import { Divider, GnotCollectSwitchWrapper, wrapper } from "./SelectUnstakeResult.styles";

interface SelectUnstakeResultProps {
  positions: PoolPositionModel[];
  isGetWGNOT: boolean;
  setIsGetWGNOT: () => void;
}

const SelectUnstakeResult: React.FC<SelectUnstakeResultProps> = ({
  positions,
  isGetWGNOT,
  setIsGetWGNOT,
}) => {
  const { t } = useTranslation();
  const { pooledTokenInfos, unclaimedRewards, totalLiquidityUSD } =
    usePositionsRewards({ positions });

  if (positions.length === 0) return <></>;
  return (
    <div css={wrapper}>
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
                {t("UnstakePosition:overview.pooled")}{" "}
                {pooledTokenInfo.token.symbol}
              </p>
              <strong>{pooledTokenInfo.amount}</strong>
            </div>
            <span className="dollar-value">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
        {unclaimedRewards.map((pooledTokenInfo, index) => {
          if (!pooledTokenInfo.amount) return null;
          return (
            <li key={index}>
              <div className="main-info">
                <MissingLogo
                  symbol={pooledTokenInfo.token.symbol}
                  url={pooledTokenInfo.token.logoURI}
                  width={24}
                  mobileWidth={24}
                />
                <p>
                  {t("UnstakePosition:overview.unclaimed")}{" "}
                  {pooledTokenInfo.token.symbol}
                </p>
                <strong>
                  {formatPoolPairAmount(pooledTokenInfo.amount, {
                    decimals: pooledTokenInfo.token.decimals,
                  })}
                </strong>
              </div>
              <span className="dollar-value">{pooledTokenInfo.amountUSD}</span>
            </li>
          );
        })}
        {unclaimedRewards.find(item => item.token.path === "gnot") && (
          <>
            <Divider />
            <GnotCollectSwitchWrapper>
              <div>{t("UnstakePosition:overview.collectAsSwitch")}</div>
              <Switch checked={isGetWGNOT} onChange={setIsGetWGNOT} />
            </GnotCollectSwitchWrapper>
          </>
        )}
      </ul>
      <div className="result-section">
        <div className="total-amount-box">
          <h5 className="total-amount-title">
            {t("UnstakePosition:overview.totalAmt")}
          </h5>
          <span className="result-value">{totalLiquidityUSD}</span>
        </div>
      </div>
    </div>
  );
};

export default SelectUnstakeResult;
