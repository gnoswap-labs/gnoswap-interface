import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { subscriptFormat } from "@utils/number-utils";

import { TooltipInfo } from "../PoolGraph.types";
import { PoolGraphTooltipContainer } from "./PoolGraphTooltip.styles";

function makeClassNameWithSmallFont(className: string, target: string, limitLength = 21) {
  const additionalClassName = "small-font";
  if (target.length > limitLength) {
    return `${className} ${additionalClassName}`;
  }
  return className;
}

function formatTooltipTokenAmount(amount: string) {
  const amountNumber = BigNumber(amount);

  if (amountNumber.isNaN() || !amountNumber.isFinite()) {
    return amount;
  }

  if (amountNumber.isGreaterThan(0) && amountNumber.isLessThan(1)) {
    return subscriptFormat(amountNumber.toFixed());
  }

  return amount;
}

function hasPositiveTokenAmount(amount?: string | null) {
  const amountText = amount?.trim() || "0";

  if (amountText.startsWith("<")) {
    return true;
  }

  return BigNumber(amountText).isGreaterThan(0);
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

  const displayTooltipInfo = useMemo(() => {
    if (!tooltipInfo) {
      return {
        price: "-",
        totalTokenAAmount: "-",
        totalTokenBAmount: "-",
        totalTokenAUsd: "-",
        totalTokenBUsd: "-",
        positionTokenAAmount: "0",
        positionTokenBAmount: "0",
        positionTokenAUsd: "$0",
        positionTokenBUsd: "$0",
      };
    }

    const { tokenB, price, tokenAAmount, tokenBAmount, positionTokenAAmount, positionTokenBAmount } = tooltipInfo;

    return {
      price: `${formatTooltipTokenAmount(price)} ${tokenB.displaySymbol}`,
      totalTokenAAmount: formatTooltipTokenAmount(tokenAAmount || "0"),
      totalTokenBAmount: formatTooltipTokenAmount(tokenBAmount || "0"),
      totalTokenAUsd: tooltipInfo.tokenAUsd || "-",
      totalTokenBUsd: tooltipInfo.tokenBUsd || "-",
      positionTokenAAmount: formatTooltipTokenAmount(positionTokenAAmount || "0"),
      positionTokenBAmount: formatTooltipTokenAmount(positionTokenBAmount || "0"),
      positionTokenAUsd: tooltipInfo.positionTokenAUsd || "$0",
      positionTokenBUsd: tooltipInfo.positionTokenBUsd || "$0",
    };
  }, [tooltipInfo]);

  if (!tooltipInfo || disabled) {
    return <React.Fragment />;
  }

  const hasPositionLiquidity =
    tooltipInfo.isPositionActive ||
    hasPositiveTokenAmount(tooltipInfo.positionTokenAAmount) ||
    hasPositiveTokenAmount(tooltipInfo.positionTokenBAmount);

  return (
    <PoolGraphTooltipContainer>
      <div className="price-row">
        <span>{t("common:price")}:</span>
        <span className="price-value">{displayTooltipInfo.price}</span>
      </div>

      {isPosition && (
        <div className="header mt-8">
          <span>Total liquidity</span>
        </div>
      )}

      <div className={`content ${isPosition ? "" : "pool-liquidity-content"}`}>
        {tooltipInfo.tokenAVisible && (
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
              <span className="token-price-value">({displayTooltipInfo.totalTokenAUsd})</span>
            </span>
          </div>
        )}

        {tooltipInfo.tokenBVisible && (
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
              <span className="token-price-value">({displayTooltipInfo.totalTokenBUsd})</span>
            </span>
          </div>
        )}
      </div>

      {isPosition && hasPositionLiquidity && (
        <React.Fragment>
          <div className="header mt-8">
            <span>Your liquidity ({tooltipInfo.positionLiquidityShare})</span>
          </div>

          <div className="content">
            {tooltipInfo.positionTokenAVisible && (
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
                  <span
                    className={makeClassNameWithSmallFont(
                      "token-amount-value",
                      displayTooltipInfo.positionTokenAAmount,
                    )}
                  >
                    {displayTooltipInfo.positionTokenAAmount}
                  </span>
                  <span className="token-price-value">({displayTooltipInfo.positionTokenAUsd})</span>
                </span>
              </div>
            )}

            {tooltipInfo.positionTokenBVisible && (
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
                  <span
                    className={makeClassNameWithSmallFont(
                      "token-amount-value",
                      displayTooltipInfo.positionTokenBAmount,
                    )}
                  >
                    {displayTooltipInfo.positionTokenBAmount}
                  </span>
                  <span className="token-price-value">({displayTooltipInfo.positionTokenBUsd})</span>
                </span>
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </PoolGraphTooltipContainer>
  );
};

export default PoolGraphTooltip;
