import React from "react";

import MarketInformation from "./market-information/MarketInformation";
import PriceInformation from "./price-information/PriceInformation";
import PricePerformance from "./price-performance/PricePerformance";

import { wrapper } from "./TokenInfoContent.styles";

interface TokenInfoContentProps {
  performance: {
    createdAt: string;
    amount: {
      status: "NEGATIVE" | "POSITIVE" | "NONE";
      value: string;
    };
    change: {
      status: "NEGATIVE" | "POSITIVE" | "NONE";
      value: string;
    };
  }[];
  priceInfo: {
    [key: string]: {
      status: "NEGATIVE" | "POSITIVE" | "NONE";
      value: string;
    };
  };
  marketInfo: {
    popularity: string;
    lockedTokensUsd: string;
    volumeUsd24h: string;
    feesUsd24h: string;
  };
  loadingPricePerform: boolean;
  loadingPriceInfo: boolean;
  loadingMarketInfo: boolean;
}

const TokenInfoContent: React.FC<TokenInfoContentProps> = ({
  performance,
  priceInfo,
  marketInfo,
  loadingPricePerform,
  loadingPriceInfo,
  loadingMarketInfo,
}) => {
  return (
    <div css={wrapper}>
      <PricePerformance info={performance} loading={loadingPricePerform}/>
      <PriceInformation info={priceInfo} loading={loadingPriceInfo}/>
      <MarketInformation info={marketInfo} loading={loadingMarketInfo}/>
    </div>
  );
};

export default TokenInfoContent;
