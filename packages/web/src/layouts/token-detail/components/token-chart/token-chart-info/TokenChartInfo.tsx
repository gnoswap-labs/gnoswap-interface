import React, { useMemo } from "react";

import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

import { TokenChartInfoWrapper } from "./TokenChartInfo.styles";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import PriceWarning from "@components/common/price-warning/PriceWarning";
import { cx } from "@emotion/css";
import { useTokenPriceInfo } from "@hooks/token/data/use-token-price-info";
import { formatDisplayTokenName } from "@utils/token-utils";

export interface TokenChartInfoProps {
  token: {
    name: string;
    symbol: string;
    displaySymbol: string;
    image: string;
  };
  priceInfo: {
    amount: {
      value: number | string;
      denom: string;
      status: MATH_NEGATIVE_TYPE;
    };
    priceGradeType: TOKEN_PRICE_GRADE_TYPE;
    changedRate: string;
  };
  isEmpty: boolean;
  loading: boolean;
}

const TokenChartInfo: React.FC<TokenChartInfoProps> = ({ token, priceInfo, loading, isEmpty }) => {
  const rateClass = useMemo(() => {
    if (isEmpty) return "";

    switch (priceInfo.amount.status) {
      case MATH_NEGATIVE_TYPE.POSITIVE:
        return "up";
      case MATH_NEGATIVE_TYPE.NEGATIVE:
        return "down";
      case MATH_NEGATIVE_TYPE.NONE:
      default:
        return "";
    }
  }, [isEmpty, priceInfo.amount.status]);

  const statusIcon = useMemo(() => {
    switch (priceInfo.amount.status) {
      case MATH_NEGATIVE_TYPE.POSITIVE:
        return <IconTriangleArrowUp className="arrow-icon" />;
      case MATH_NEGATIVE_TYPE.NEGATIVE:
        return <IconTriangleArrowDown className="arrow-icon" />;
      default:
        return <></>;
    }
  }, [priceInfo.amount.status]);

  const displayPrice = useMemo(() => {
    return !priceInfo.amount.value || loading ? "-" : priceInfo.amount.value;
  }, [loading, priceInfo.amount.value]);

  const displayRate = useMemo(() => {
    if (isEmpty) {
      return "-";
    }

    return priceInfo.changedRate;
  }, [isEmpty, priceInfo.changedRate]);

  const { priceStyle, shouldShowPriceWarning } = useTokenPriceInfo({ priceGradeType: priceInfo.priceGradeType });

  return (
    <TokenChartInfoWrapper>
      <div className="token-info-wrapper">
        <div className="token-info">
          {loading && <div css={pulseSkeletonStyle({ w: "207px", h: 20 })} className="loading-skeleton" />}
          {!loading && (
            <MissingLogo symbol={token.symbol} url={token.image} className="token-image" width={36} mobileWidth={36} />
          )}
          {!loading && (
            <div>
              <span className="token-name">{formatDisplayTokenName(token.name)}</span>
              <span className="token-symbol">{token.displaySymbol}</span>
            </div>
          )}
        </div>
        <div className="price-info">
          {
            <div className={cx(priceStyle.className)}>
              <span className="price">{displayPrice}</span>
              {shouldShowPriceWarning && <PriceWarning type="PRICE" />}
            </div>
          }
          {priceInfo.amount.value && !loading ? (
            <div className={`change-rate-wrapper ${rateClass}`}>
              {statusIcon}
              <span>{displayRate}</span>
            </div>
          ) : (
            <></>
          )}
          {(loading || !priceInfo.amount.value) && <div className="change-rate-wrapper">&nbsp;</div>}
        </div>
      </div>
    </TokenChartInfoWrapper>
  );
};

export default TokenChartInfo;
