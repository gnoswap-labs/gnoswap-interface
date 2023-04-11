import React from "react";
import MarketInformation from "@components/token/market-information/MarketInformation";
import PriceInformation from "@components/token/price-information/PriceInformation";
import PricePerformance from "@components/token/price-performance/PricePerformance";
import { wrapper } from "./TokenInfoContent.styles";

interface TokenInfoContentProps {
  performance: any;
  priceInfo: any;
  marketInfo: any;
}

const TokenInfoContent: React.FC<TokenInfoContentProps> = ({
  performance,
  priceInfo,
  marketInfo,
}) => {
  return (
    <div css={wrapper}>
      <PricePerformance info={performance} />
      <PriceInformation info={priceInfo} />
      <MarketInformation info={marketInfo} />
    </div>
  );
};

export default TokenInfoContent;
