import React from "react";

import { IPriceResponse } from "@repositories/token";
import { getLocalizeTime } from "@utils/chart";

import LineGraph, { LineGraphData } from "@components/common/line-graph/LineGraph";
import { ChartNotFound, LoadingWrapper, SwapTokenChartWrapper } from "./SwapTokenChart.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { SWAP_TOKEN_CHART_COLORS } from "@constants/graph.constant";

interface SwapTokenChartProps {
  data: IPriceResponse[];
  isLoading: boolean;
  isFetched: boolean;
  isChartHovered: boolean;
  onMouseMove: (data?: LineGraphData) => void;
  onMouseOut: () => void;
  onMouseHover: () => void;
  onMouseLeave: () => void;
}

const SwapTokenChart = ({
  data = [],
  isLoading,
  isFetched,
  isChartHovered,
  onMouseMove,
  onMouseOut,
  onMouseHover,
  onMouseLeave,
}: SwapTokenChartProps) => {
  const hasData = isFetched && data && data.length > 0;
  const isNoData = isFetched && !isLoading && !data;

  const chartData = React.useMemo(() => {
    if (!hasData) return [];
    return data.map(item => {
      return {
        value: item.price,
        time: getLocalizeTime(item.time),
      };
    });
  }, [hasData, data]);

  const handleMouseMove = React.useCallback(
    (data?: LineGraphData) => {
      onMouseMove(data);
    },
    [onMouseMove],
  );

  const handleMouseOut = React.useCallback(() => {
    if (!isChartHovered) {
      onMouseOut();
    }
  }, [onMouseOut, isChartHovered]);

  return (
    <SwapTokenChartWrapper onMouseEnter={onMouseHover} onMouseLeave={onMouseLeave}>
      {isLoading && (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      )}
      {isNoData && <ChartNotFound>No price history</ChartNotFound>}
      {hasData && (
        <LineGraph
          datas={chartData}
          width={500}
          height={50}
          forcedHeight={50}
          color="#192EA2"
          gradientStartColor={SWAP_TOKEN_CHART_COLORS.GRADIENT.START}
          gradientEndColor={SWAP_TOKEN_CHART_COLORS.GRADIENT.END}
          strokeWidth={1}
          hasNoLabel={true}
          cursor
          isShowTooltip={false}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
        />
      )}
    </SwapTokenChartWrapper>
  );
};

export default SwapTokenChart;
