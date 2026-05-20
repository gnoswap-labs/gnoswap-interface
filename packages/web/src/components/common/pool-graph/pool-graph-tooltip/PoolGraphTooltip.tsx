import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";

import { TooltipInfo } from "../PoolGraph.types";
import { PoolGraphTooltipContainer } from "./PoolGraphTooltip.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

function makeClassNameWithSmallFont(className: string, target: string, limitLength = 21) {
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
  const { breakpoint } = useWindowSize();
  const { t } = useTranslation();

  const displayTooltipInfo = useMemo(() => {
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
      tokenAPrice: `${tokenAPrice} ${tokenB.displaySymbol}`,
      tokenBPrice: `${tokenBPrice} ${tokenA.displaySymbol}`,
      tokenAPriceRange:
        breakpoint === DEVICE_TYPE.MOBILE
          ? `${tokenARange.min} - ${tokenARange.max}`
          : `${tokenARange.min} - ${tokenARange.max} ${tokenB.displaySymbol}`,
      tokenBPriceRange:
        breakpoint === DEVICE_TYPE.MOBILE
          ? `${tokenBRange.max} - ${tokenBRange.min}`
          : `${tokenBRange.max} - ${tokenBRange.min} ${tokenA.displaySymbol}`,
      totalTokenAAmount: tokenAAmount || "0",
      totalTokenBAmount: tokenBAmount || "0",
      depositTokenAAmount: depositTokenAAmount || "0",
      depositTokenBAmount: depositTokenBAmount || "0",
    };
  }, [tooltipInfo, breakpoint]);

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
              {tooltipInfo.tokenA.displaySymbol} {t("common:price")}
            </span>
          </span>
          <span className={"token-amount-value price"}>{displayTooltipInfo.tokenAPrice}</span>
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
              {tooltipInfo.tokenB.displaySymbol} {t("common:price")}
            </span>
          </span>
          <span className={"token-amount-value price"}>{displayTooltipInfo.tokenBPrice}</span>
        </div>
      </div>

      <div className="header mt-8">
        <div className="row">
          <span className="token token-title">{t("business:token")}</span>
          <span className="amount total-amount">{t("common:poolGraph.tooltip.totalAmt")}</span>
          {isDisplayPositionAmount && (
            <span className="amount w-100 in-header">{t("common:poolGraph.tooltip.positionAmt")}</span>
          )}
          <span className="price-range">{t("common:poolGraph.tooltip.priceRange")}</span>
        </div>
      </div>

      <div className="content">
        <div className="row">
          <span className="content-token">
            <MissingLogo
              symbol={tooltipInfo.tokenA.symbol}
              url={tooltipInfo.tokenA.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span className="symbol">{tooltipInfo.tokenA.displaySymbol}</span>
          </span>
          <span className="amount total-amount">
            <span className={makeClassNameWithSmallFont("token-amount-value", displayTooltipInfo.totalTokenAAmount)}>
              {displayTooltipInfo.totalTokenAAmount}
            </span>
          </span>

          {isDisplayPositionAmount && (
            <span className="amount w-100">
              <span className="token-amount-value">{displayTooltipInfo.depositTokenAAmount}</span>
            </span>
          )}
          <span
            className={makeClassNameWithSmallFont(
              "token-amount-value price-range",
              displayTooltipInfo.tokenAPriceRange,
            )}
          >
            {displayTooltipInfo.tokenAPriceRange}
          </span>
        </div>

        <div className="row">
          <span className="content-token">
            <MissingLogo
              symbol={tooltipInfo.tokenB.symbol}
              url={tooltipInfo.tokenB.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span className="symbol">{tooltipInfo.tokenB.displaySymbol}</span>
          </span>
          <span className="amount total-amount">
            <span className={makeClassNameWithSmallFont("token-amount-value", displayTooltipInfo.totalTokenBAmount)}>
              {displayTooltipInfo.totalTokenBAmount}
            </span>
          </span>
          {isDisplayPositionAmount && (
            <span className="amount w-100">
              <span className="token-amount-value">{displayTooltipInfo.depositTokenBAmount}</span>
            </span>
          )}
          <span
            className={makeClassNameWithSmallFont(
              "token-amount-value price-range",
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
