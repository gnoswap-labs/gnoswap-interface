import React, { useMemo } from "react";
import MissingLogo from "../missing-logo/MissingLogo";
import { TokenModel } from "@models/token/token-model";
import { useTranslation } from "react-i18next";

export interface TooltipInfo {
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string | null;
  tokenBAmount: string | null;
  tokenARange: {
    min: string | null;
    max: string | null;
  };
  tokenBRange: {
    min: string | null;
    max: string | null;
  };
  tokenAPrice: string;
  tokenBPrice: string;
}

interface PoolSelectionGraphBinTooptipProps {
  tooltipInfo: TooltipInfo | null;
}

export const PoolSelectionGraphBinTooptip: React.FC<
  PoolSelectionGraphBinTooptipProps
> = ({ tooltipInfo }) => {
  const { t } = useTranslation();

  const tokenAPriceString = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenAPrice, tokenB } = tooltipInfo;
    if (!tokenAPrice) {
      return "-";
    }
    return `${tokenAPrice} ${tokenB.symbol}`;
  }, [tooltipInfo]);

  const tokenBPriceString = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenBPrice, tokenA } = tooltipInfo;
    if (!tokenBPrice) {
      return "-";
    }
    return `${tokenBPrice} ${tokenA.symbol}`;
  }, [tooltipInfo]);

  const tokenAPriceRangeStr = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenARange, tokenB } = tooltipInfo;
    if (tokenARange?.min === null || tokenARange?.max === null) {
      return "-";
    }
    return `${tokenARange.min} - ${tokenARange.max} ${tokenB.symbol}`;
  }, [tooltipInfo]);

  const tokenBPriceRangeStr = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenBRange, tokenA } = tooltipInfo;
    if (tokenBRange?.min === null || tokenBRange?.max === null) {
      return "-";
    }
    return `${tokenBRange.max} - ${tokenBRange.min} ${tokenA.symbol}`;
  }, [tooltipInfo]);

  return tooltipInfo ? (
    <div className="tooltip-wrapper">
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
          <span className="price-range">{tokenAPriceString}</span>
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
          <span className="price-range">{tokenBPriceString}</span>
        </div>
      </div>
      <div className="header mt-8">
        <div className="row">
          <span className="token token-title">{t("business:token")}</span>
          <span className="amount total-amount">
            {t("common:poolGraph.tooltip.totalAmt")}
          </span>
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
            <MissingLogo
              symbol={tooltipInfo.tokenA.symbol}
              url={tooltipInfo.tokenA.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span
              className={`hidden ${
                (tooltipInfo.tokenAAmount || "0").length > 21
                  ? "small-font"
                  : ""
              }`}
            >
              {tooltipInfo.tokenAAmount || "0"}
            </span>
          </span>
          <span
            className={`price-range ${
              (tokenAPriceRangeStr.length || 0) > 21 ? "small-font" : ""
            }`}
          >
            {tokenAPriceRangeStr}
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
            <MissingLogo
              symbol={tooltipInfo.tokenB.symbol}
              url={tooltipInfo.tokenB.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span
              className={`hidden ${
                (tooltipInfo.tokenBAmount || "0").length > 21
                  ? "small-font"
                  : ""
              }`}
            >
              {tooltipInfo.tokenBAmount || "0"}
            </span>
          </span>
          <span
            className={`price-range ${
              (tokenBPriceRangeStr || "0").length > 21 ? "small-font" : ""
            }`}
          >
            {tokenBPriceRangeStr}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};
