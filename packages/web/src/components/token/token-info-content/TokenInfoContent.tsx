import React from "react";
import MarketInformation from "@components/token/market-information/MarketInformation";
import PriceInformation from "@components/token/price-information/PriceInformation";
import PricePerformance from "@components/token/price-performance/PricePerformance";
import { wrapper } from "./TokenInfoContent.styles";

interface TokenInfoContentProps {
  performance: any;
  priceInfo: any;
  marketInfo: any;
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
