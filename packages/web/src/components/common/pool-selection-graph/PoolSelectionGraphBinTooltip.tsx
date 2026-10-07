import React, { useMemo } from "react";
import MissingLogo from "../missing-logo/MissingLogo";
import { TokenModel } from "@models/token/token-model";
import { useTranslation } from "react-i18next";

export interface TooltipInfo {
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string | null;
  tokenBAmount: string | null;
  tokenAVisible: boolean;
  tokenBVisible: boolean;
  price: string;
}

interface PoolSelectionGraphBinTooptipProps {
  tooltipInfo: TooltipInfo | null;
}

export const PoolSelectionGraphBinTooptip: React.FC<PoolSelectionGraphBinTooptipProps> = ({ tooltipInfo }) => {
  const { t } = useTranslation();

  const priceString = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { price, tokenB } = tooltipInfo;
    if (!price) {
      return "-";
    }
    return `${price} ${tokenB.displaySymbol}`;
  }, [tooltipInfo]);

  return tooltipInfo ? (
    <div className="tooltip-wrapper">
      <div className="price-row">
        <span>{t("common:price")}:</span>
        <span className="price-value">{priceString}</span>
      </div>
      <div className="content pool-liquidity-content">
        {tooltipInfo.tokenAVisible && (
          <div className="row">
            <span className="token">
              <MissingLogo
                symbol={tooltipInfo.tokenA.symbol}
                url={tooltipInfo.tokenA.logoURI}
                className="logo"
                width={20}
                mobileWidth={20}
              />
              <span>{tooltipInfo.tokenA.displaySymbol}</span>
            </span>
            <span className="amount total-amount">
              <MissingLogo
                symbol={tooltipInfo.tokenA.symbol}
                url={tooltipInfo.tokenA.logoURI}
                className="logo"
                width={20}
                mobileWidth={20}
              />
              <span className={`hidden ${(tooltipInfo.tokenAAmount || "0").length > 21 ? "small-font" : ""}`}>
                {tooltipInfo.tokenAAmount || "0"}
              </span>
            </span>
          </div>
        )}
        {tooltipInfo.tokenBVisible && (
          <div className="row">
            <span className="token">
              <MissingLogo
                symbol={tooltipInfo.tokenB.symbol}
                url={tooltipInfo.tokenB.logoURI}
                className="logo"
                width={20}
                mobileWidth={20}
              />
              <span>{tooltipInfo.tokenB.displaySymbol}</span>
            </span>
            <span className="amount total-amount">
              <MissingLogo
                symbol={tooltipInfo.tokenB.symbol}
                url={tooltipInfo.tokenB.logoURI}
                className="logo"
                width={20}
                mobileWidth={20}
              />
              <span className={`hidden ${(tooltipInfo.tokenBAmount || "0").length > 21 ? "small-font" : ""}`}>
                {tooltipInfo.tokenBAmount || "0"}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};
