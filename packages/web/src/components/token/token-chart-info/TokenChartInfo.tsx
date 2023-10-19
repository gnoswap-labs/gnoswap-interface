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
}

const TokenChartInfo: React.FC<TokenChartInfoProps> = ({
  token,
  priceInfo
}) => {

  const isIncreasePrice = useCallback(() => {
    const changedRate = priceInfo.changedRate;
    return changedRate > 0;
  }, [priceInfo.changedRate]);

  return (
    <TokenChartInfoWrapper>
      <div className="token-info-wrapper">
        <div className="token-info">
          <img src={token.image} className="token-image" alt="token image" />
          <span className="token-name">{token.name}</span>
          <span className="token-symbol">{token.symbol}</span>
        </div>
        <div className="price-info">
          <span className="price">{`$ ${priceInfo.amount.value}`}</span>
        </div>
      </div>
      <div className={`change-rate-wrapper ${isIncreasePrice() ? "up" : "down"}`}>
        {
          isIncreasePrice() ?
            <IconTriangleArrowUp className="arrow-icon" /> :
            <IconTriangleArrowDown className="arrow-icon" />
        }
        <span>{priceInfo.changedRate}%</span>
      </div>
    </TokenChartInfoWrapper>
  );
};

export default TokenChartInfo;