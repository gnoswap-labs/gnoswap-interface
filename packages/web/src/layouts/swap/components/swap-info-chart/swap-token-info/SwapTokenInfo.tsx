import React from "react";

import { LineGraphData } from "@components/common/line-graph/LineGraph";
import { isNativeTokenByType, TokenModel } from "@models/token/token-model";
import { RefetchInterval } from "@common/values";

import useElementWidth from "@hooks/common/use-element-width";
import { useGetTokenPrices } from "@query/token";
import SwapTokenChart from "./SwapTokenChart";
import SwapTokenHeader from "./SwapTokenHeader";
import { SwapTokenInfoWrapper } from "./SwapTokenInfo.styles";
import { formatPrice } from "@utils/new-number-utils";

interface SwapTokenInfoProps {
  token: TokenModel;
}

const SwapTokenInfo = ({ token }: SwapTokenInfoProps) => {
  const [chartData, setChartData] = React.useState<LineGraphData | undefined>();
  const [isChartHovered, setIsChartHovered] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerWidth = useElementWidth(containerRef);

  const tokenData = React.useMemo(() => {
    return {
      name: token.name,
      symbol: token.symbol,
      displaySymbol: token.displaySymbol,
      logoURI: token.logoURI,
      path: isNativeTokenByType(token.type) ? token.wrappedPath : token.path,
      tokenId: token.tokenId,
      isNative: isNativeTokenByType(token.type),
    };
  }, [token]);

  const { data: { usd: rawCurrentPrice } = {} } = useGetTokenPrices(tokenData.path as string, {
    enabled: !!tokenData.path,
  });

  const currentPrice = React.useMemo(() => {
    return formatPrice(rawCurrentPrice, {
      isKMB: false,
      greaterThan1Decimals: 2,
      forcedDecimals: true,
    });
  }, [rawCurrentPrice]);

  const {
    data: { priceGradeType, last7d = [] } = {},
    isLoading,
    isFetched,
  } = useGetTokenPrices(tokenData.path as string, {
    enabled: !!tokenData.path,
    refetchInterval: RefetchInterval.Frequent,
  });

  const handleMouseMove = React.useCallback((data?: LineGraphData) => {
    setChartData(data);
  }, []);

  const handleMouseOut = React.useCallback(() => {
    handleMouseMove(undefined);
  }, [handleMouseMove]);

  // @dev If the selected token changes, reset the chart data.
  React.useEffect(() => {
    handleMouseOut();
  }, [tokenData, handleMouseOut]);

  return (
    <SwapTokenInfoWrapper ref={containerRef}>
      <SwapTokenHeader
        tokenInfo={tokenData}
        priceGradeType={priceGradeType || "NONE"}
        currentPrice={currentPrice}
        chartData={chartData}
        containerWidth={containerWidth}
      />
      <SwapTokenChart
        data={last7d}
        isLoading={isLoading}
        isFetched={isFetched}
        isChartHovered={isChartHovered}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseHover={() => setIsChartHovered(true)}
        onMouseLeave={() => setIsChartHovered(false)}
      />
    </SwapTokenInfoWrapper>
  );
};

export default SwapTokenInfo;
