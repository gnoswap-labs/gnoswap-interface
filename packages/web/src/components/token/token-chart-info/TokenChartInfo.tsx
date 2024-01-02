import React, { useCallback } from "react";
import { TokenChartInfoWrapper } from "./TokenChartInfo.styles";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { convertToMB } from "@utils/stake-position-utils";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

export interface TokenChartInfoProps {
  token: {
    name: string;
    symbol: string;
    image: string;
  };
  priceInfo: {
    amount: {
      value: number | string;
      denom: string;
      status: MATH_NEGATIVE_TYPE;
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
    return priceInfo.amount.status === MATH_NEGATIVE_TYPE.POSITIVE;
  }, [priceInfo.amount.status]);
  
  return (
    <TokenChartInfoWrapper>
      <div className="token-info-wrapper">
        <div className="token-info">
          <MissingLogo symbol={token.symbol} url={token.image} className="token-image" width={36} mobileWidth={36}/>
          <div>
            <span className="token-name">{token.name}</span>
            <span className="token-symbol">{token.symbol}</span>
          </div>
        </div>
        <div className="price-info">
          {<span className="price">{(!priceInfo.amount.value || loading) ? "-" : `$${priceInfo.amount.value === 0 ? "0.00" : convertToMB(priceInfo.amount.value.toString(), 6)}`}</span>}
          {(priceInfo.amount.value && !loading) ? <div className={`change-rate-wrapper ${isIncreasePrice() ? "up" : "down"}`}>
            {
              isIncreasePrice() ?
                <IconTriangleArrowUp className="arrow-icon" /> :
                <IconTriangleArrowDown className="arrow-icon" />
            }
            <span>{priceInfo.changedRate.toFixed(2)}%</span>
          </div> : <></>}
          {(loading || !priceInfo.amount.value)&& <div className="change-rate-wrapper">&nbsp;</div>}
        </div>
      </div>
    </TokenChartInfoWrapper>
  );
};

export default TokenChartInfo;