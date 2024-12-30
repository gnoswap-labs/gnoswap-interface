import React from "react";

import { IPriceResponse } from "@repositories/token";
import { getLocalizeTime } from "@utils/chart";

import LineGraph, { LineGraphData } from "@components/common/line-graph/LineGraph";
import { ChartNotFound, LoadingChart, SwapTokenChartWrapper } from "./SwapTokenChart.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface SwapTokenChartProps {
  data: IPriceResponse[];
  isLoading: boolean;
  isFetched: boolean;
  onMouseMove: (data?: LineGraphData) => void;
}

const SwapTokenChart = ({ data = [], isLoading, isFetched, onMouseMove }: SwapTokenChartProps) => {
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

  return (
    <SwapTokenChartWrapper>
      {isLoading && (
        <LoadingChart>
          <LoadingSpinner />
        </LoadingChart>
      )}
      {isNoData && <ChartNotFound>No Data</ChartNotFound>}
      {hasData && (
        <LineGraph
          datas={chartData}
          height={50}
          forcedHeight={50}
          color="#192EA2"
          strokeWidth={1}
          hasNoLabel={true}
          cursor
          smooth
          isShowTooltip={false}
          onMouseMove={onMouseMove}
        />
      )}
    </SwapTokenChartWrapper>
  );
};

export default SwapTokenChart;
