import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";

import { TooltipInfo } from "../PoolGraph.types";
import { PoolGraphTooltipContainer } from "./PoolGraphTooltip.styles";

function makeClassNameWithSmallFont(
  className: string,
  target: string,
  limitLength = 21,
) {
  const additionalClassName = "small-font";
  if (target.length > limitLength) {
    return `${className} ${additionalClassName}`;
  }
  return className;
}

export interface PoolGraphTooltipProps {
  tooltipInfo: TooltipInfo | null;
  isPosition: boolean;
  disabled?: boolean;
}

const PoolGraphTooltip: React.FC<React.PropsWithRef<PoolGraphTooltipProps>> = ({
  tooltipInfo,
  isPosition,
  disabled,
}) => {
  const { t } = useTranslation();

  const displayTooltipInfo: {
    tokenAPrice: string;
    tokenBPrice: string;
    tokenAPriceRange: string;
    tokenBPriceRange: string;
    totalTokenAAmount: string;
    totalTokenBAmount: string;
    depositTokenAAmount: string;
    depositTokenBAmount: string;
  } = useMemo(() => {
    if (!tooltipInfo) {
      return {
        tokenAPrice: "-",
        tokenBPrice: "-",
        tokenAPriceRange: "-",
        tokenBPriceRange: "-",
        totalTokenAAmount: "-",
        totalTokenBAmount: "-",
        depositTokenAAmount: "-",
        depositTokenBAmount: "-",
      };
    }

    const {
      tokenA,
      tokenB,
      tokenAPrice,
      tokenBPrice,
      tokenARange,
      tokenBRange,
      tokenAAmount,
      tokenBAmount,
      depositTokenAAmount,
      depositTokenBAmount,
    } = tooltipInfo;

    return {
      tokenAPrice: `${tokenAPrice} ${tokenB.symbol}`,
      tokenBPrice: `${tokenBPrice} ${tokenA.symbol}`,
      tokenAPriceRange: `${tokenARange.min} - ${tokenARange.max} ${tokenB.symbol}`,
      tokenBPriceRange: `${tokenBRange.max} - ${tokenBRange.min} ${tokenA.symbol}`,
      totalTokenAAmount: tokenAAmount || "0",
      totalTokenBAmount: tokenBAmount || "0",
      depositTokenAAmount: depositTokenAAmount || "0",
      depositTokenBAmount: depositTokenBAmount || "0",
    };
  }, [tooltipInfo]);

  const isDisplayPositionAmount = useMemo(() => {
    if (!!tooltipInfo?.disabled) {
      return false;
    }
    return isPosition;
  }, [isPosition, tooltipInfo?.disabled]);

  if (!tooltipInfo || disabled) {
    return <React.Fragment />;
  }

  return (
    <PoolGraphTooltipContainer>
      <div className="header">
        <div className="row">
          <span className="token">{t("common:poolGraph.tooltip.quote")}</span>
          <span className="price-range">{t("business:currentPrice")}</span>
        </div>
      </div>

      <div className="content">
        <div className="row">
          <span className="token">
            <MissingLogo
              symbol={tooltipInfo.tokenA.symbol}
              url={tooltipInfo.tokenA.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span>
              {tooltipInfo.tokenA.symbol} {t("common:price")}
            </span>
          </span>
          <span className="price-range">
            {displayTooltipInfo.tokenAPriceRange}
          </span>
        </div>

        <div className="row">
          <span className="token">
            <MissingLogo
              symbol={tooltipInfo.tokenB.symbol}
              url={tooltipInfo.tokenB.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span>
              {tooltipInfo.tokenB.symbol} {t("common:price")}
            </span>
          </span>
          <span className="price-range">
            {displayTooltipInfo.tokenBPriceRange}
          </span>
        </div>
      </div>

      <div className="header mt-8">
        <div className="row">
          <span className="token token-title">{t("business:token")}</span>
          <span className="amount total-amount">
            {t("common:poolGraph.tooltip.totalAmt")}
          </span>
          {isDisplayPositionAmount && (
            <span className="amount w-100">
              {t("common:poolGraph.tooltip.positionAmt")}
            </span>
          )}
          <span className="price-range">
            {t("common:poolGraph.tooltip.priceRange")}
          </span>
        </div>
      </div>

      <div className="content">
        <div className="row">
          <span className="token">
            <MissingLogo
              symbol={tooltipInfo.tokenA.symbol}
              url={tooltipInfo.tokenA.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span>{tooltipInfo.tokenA.symbol}</span>
          </span>
          <span className="amount total-amount">
            <span
              className={makeClassNameWithSmallFont(
                "token-amount-value",
                displayTooltipInfo.totalTokenAAmount,
              )}
            >
              {displayTooltipInfo.totalTokenAAmount}
            </span>
          </span>

          {isDisplayPositionAmount && (
            <span className="amount w-100">
              <span className="token-amount-value">
                {displayTooltipInfo.depositTokenAAmount}
              </span>
            </span>
          )}
          <span
            className={makeClassNameWithSmallFont(
              "token-amount-value",
              displayTooltipInfo.tokenAPriceRange,
            )}
          >
            {displayTooltipInfo.tokenAPriceRange}
          </span>
        </div>

        <div className="row">
          <span className="token">
            <MissingLogo
              symbol={tooltipInfo.tokenB.symbol}
              url={tooltipInfo.tokenB.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span>{tooltipInfo.tokenB.symbol}</span>
          </span>
          <span className="amount total-amount">
            <span
              className={makeClassNameWithSmallFont(
                "token-amount-value",
                displayTooltipInfo.totalTokenBAmount,
              )}
            >
              {displayTooltipInfo.totalTokenBAmount}
            </span>
          </span>
          {isDisplayPositionAmount && (
            <span className="amount w-100">
              <span className="token-amount-value">
                {displayTooltipInfo.depositTokenBAmount}
              </span>
            </span>
          )}
          <span
            className={makeClassNameWithSmallFont(
              "token-amount-value",
              displayTooltipInfo.tokenBPriceRange,
            )}
          >
            {displayTooltipInfo.tokenBPriceRange}
          </span>
        </div>
      </div>
    </PoolGraphTooltipContainer>
  );
};

export default PoolGraphTooltip;
