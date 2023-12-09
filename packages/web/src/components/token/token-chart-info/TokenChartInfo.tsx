import React, { useCallback } from "react";
import { TokenChartInfoWrapper } from "./TokenChartInfo.styles";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";

export interface TokenChartInfoProps {
  token: {
    name: string;
    symbol: string;
    image: string;
  };
  priceInfo: {
    amount: {
      value: number;
      denom: string;
    };
    changedRate: number;
  };
  loading: boolean;
}

const TokenChartInfo: React.FC<TokenChartInfoProps> = ({
  token,
  priceInfo,
  loading,
}) => {

  const isIncreasePrice = useCallback(() => {
    const changedRate = priceInfo.changedRate;
    return changedRate >= 0;
  }, [priceInfo.changedRate]);

  return (
    <TokenChartInfoWrapper>
      <div className="token-info-wrapper">
        <div className="token-info">
          {token.image ? <img src={token.image} className="token-image" alt="token image" /> : <div className="fake-logo">{(token.symbol ?? "").slice(0,3)}</div>}
          <div>
            <span className="token-name">{token.name}</span>
            <span className="token-symbol">{token.symbol}</span>
          </div>
        </div>
        <div className="price-info">
          {<span className="price">{loading ? "-" : `$${priceInfo.amount.value === 0 ? "0.00" : priceInfo.amount.value}`}</span>}
          {!loading && <div className={`change-rate-wrapper ${isIncreasePrice() ? "up" : "down"}`}>
            {
              isIncreasePrice() ?
                <IconTriangleArrowUp className="arrow-icon" /> :
                <IconTriangleArrowDown className="arrow-icon" />
            }
            <span>{priceInfo.changedRate.toFixed(2)}%</span>
          </div>}
          {loading && <div className="change-rate-wrapper">&nbsp;</div>}
        </div>
      </div>
    </TokenChartInfoWrapper>
  );
};

export default TokenChartInfo;