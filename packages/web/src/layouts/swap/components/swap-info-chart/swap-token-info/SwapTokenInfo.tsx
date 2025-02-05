import React from "react";

import { LineGraphData } from "@components/common/line-graph/LineGraph";
import { isNativeTokenByType, TokenModel } from "@models/token/token-model";

import useElementWidth from "@hooks/common/use-element-width";
import { useGetTokenDetails, useGetTokenPrices } from "@query/token";
import SwapTokenChart from "./SwapTokenChart";
import SwapTokenHeader from "./SwapTokenHeader";
import { SwapTokenInfoWrapper } from "./SwapTokenInfo.styles";

interface SwapTokenInfoProps {
  token: TokenModel;
}

const SwapTokenInfo = ({ token }: SwapTokenInfoProps) => {
  const [chartData, setChartData] = React.useState<LineGraphData | undefined>();
  const [isChartHovered, setIsChartHovered] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerWidth = useElementWidth(containerRef);

  const tokenData = React.useMemo(
    () => ({
      name: token.name,
      symbol: token.symbol,
      logoURI: token.logoURI,
      path: isNativeTokenByType(token.type) ? token.wrappedPath : token.path,
      isNative: isNativeTokenByType(token.type),
    }),
    [token],
  );

  const { data: { usd: currentPrice } = {} } = useGetTokenPrices(tokenData.path as string, {
    enabled: !!tokenData.path,
  });

  const {
    data: { prices7d = [] } = {},
    isLoading,
    isFetched,
  } = useGetTokenDetails(tokenData.path as string, {
    enabled: !!tokenData.path,
  });

  const handleMouseMove = React.useCallback(
    (data?: LineGraphData) => {
      setChartData(data);
    },
    [tokenData.path],
  );

  const handleMouseOut = React.useCallback(() => {
    handleMouseMove(undefined);
  }, [tokenData.path]);

  // @dev If the selected token changes, reset the chart data.
  React.useEffect(() => {
    handleMouseOut();
  }, [tokenData, handleMouseOut]);

  return (
    <SwapTokenInfoWrapper ref={containerRef}>
      <SwapTokenHeader
        tokenInfo={tokenData}
        currentPrice={currentPrice}
        chartData={chartData}
        containerWidth={containerWidth}
      />
      <SwapTokenChart
        data={prices7d}
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
