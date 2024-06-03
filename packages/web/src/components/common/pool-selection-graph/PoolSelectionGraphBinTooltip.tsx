import React, { useMemo } from "react";
import MissingLogo from "../missing-logo/MissingLogo";
import { TokenModel } from "@models/token/token-model";

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
          <span className="token">Quote</span>
          <span className="price-range">Current Price</span>
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
            <span>{tooltipInfo.tokenA.symbol} Price</span>
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
            <span>{tooltipInfo.tokenB.symbol} Price</span>
          </span>
          <span className="price-range">{tokenBPriceString}</span>
        </div>
      </div>
      <div className="header mt-8">
        <div className="row">
          <span className="token token-title">Token</span>
          <span className="amount total-amount">Total Amt.</span>
          <span className="price-range">Price Range</span>
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
