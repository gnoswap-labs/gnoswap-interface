import React from "react";

import { TokenModel } from "@models/token/token-model";
import { LineGraphData } from "@components/common/line-graph/LineGraph";

import { SwapTokenInfoWrapper } from "./SwapTokenInfo.styles";
import SwapTokenHeader from "./SwapTokenHeader";
import { useGetTokenDetails, useGetTokenPrices } from "@query/token";
import SwapTokenChart from "./SwapTokenChart";
import { useWindowSize } from "@hooks/common/use-window-size";

interface SwapTokenInfoProps {
  token: TokenModel;
}

const SwapTokenInfo = ({ token }: SwapTokenInfoProps) => {
  const { isMobile, breakpoint, width } = useWindowSize();
  const [chartData, setChartData] = React.useState<LineGraphData | undefined>();
  const [isChartHovered, setIsChartHovered] = React.useState(false);

  const tokenData = React.useMemo(
    () => ({
      name: token.name,
      symbol: token.symbol,
      logoURI: token.logoURI,
      path: token.type === "native" ? token.wrappedPath : token.path,
      isNative: token.type === "native",
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
    <SwapTokenInfoWrapper>
      <SwapTokenHeader
        breakpoint={breakpoint}
        isMobile={isMobile}
        tokenInfo={tokenData}
        currentPrice={currentPrice}
        chartData={chartData}
        width={width}
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
