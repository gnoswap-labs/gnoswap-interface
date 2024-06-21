import { useUnstakeData } from "@hooks/stake/use-unstake-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import React from "react";
import { wrapper } from "./SelectUnstakeResult.styles";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import BigNumber from "bignumber.js";

interface SelectUnstakeResultProps {
  positions: PoolPositionModel[];
}

const SelectUnstakeResult: React.FC<SelectUnstakeResultProps> = ({
  positions,
}) => {
  const { pooledTokenInfos, unclaimedRewards, totalLiquidityUSD } =
    useUnstakeData({ positions });

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
              <p>Pooled {pooledTokenInfo.token.symbol}</p>
              <strong>
                {pooledTokenInfo.amount.toLocaleString("en", {
                  minimumFractionDigits: 6,
                })}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
        {unclaimedRewards.map((pooledTokenInfo, index) => (
          <li key={index}>
            <div className="main-info">
              <MissingLogo
                symbol={pooledTokenInfo.token.symbol}
                url={pooledTokenInfo.token.logoURI}
                width={24}
                mobileWidth={24}
              />
              <p>Unclaimed {pooledTokenInfo.token.symbol}</p>
              <strong>
                {BigNumber(pooledTokenInfo.amount).isZero()
                  ? "0"
                  : pooledTokenInfo.amount.toLocaleString("en", {
                    minimumFractionDigits: 6,
                  })}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
      </ul>
      <div className="result-section">
        <div className="total-amount-box">
          <h5 className="total-amount-title">Total Amount</h5>
          <span className="result-value">{totalLiquidityUSD}</span>
        </div>
      </div>
    </div>
  );
};

export default SelectUnstakeResult;
