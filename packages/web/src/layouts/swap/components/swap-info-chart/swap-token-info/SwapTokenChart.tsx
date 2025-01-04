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
  onMouseMove: (data?: LineGraphData) => void;
  onMouseOut: () => void;
}

const SwapTokenChart = ({ data = [], isLoading, isFetched, onMouseMove, onMouseOut }: SwapTokenChartProps) => {
  const hasData = isFetched && data && data.length > 0;
  const isNoData = isFetched && !isLoading && !data;

  const chartData = React.useMemo(() => {
    if (!hasData) return [];
    return data
      .map(item => {
        return {
          value: item.price,
          time: getLocalizeTime(item.time),
        };
      })
      .reverse();
  }, [hasData, data]);

  return (
    <SwapTokenChartWrapper>
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
          onMouseMove={onMouseMove}
          onMouseOut={onMouseOut}
        />
      )}
    </SwapTokenChartWrapper>
  );
};

export default SwapTokenChart;
