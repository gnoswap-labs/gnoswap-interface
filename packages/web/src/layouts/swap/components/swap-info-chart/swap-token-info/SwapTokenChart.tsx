import React from "react";

import { IPriceResponse } from "@repositories/token";
import { getLocalizeTime } from "@utils/chart";

import LineGraph from "@components/common/line-graph/LineGraph";
import { LoadingChart, SwapTokenChartWrapper } from "./SwapTokenChart.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface SwapTokenChartProps {
  data: IPriceResponse[];
  isLoading: boolean;
}

const SwapTokenChart = ({ data = [], isLoading }: SwapTokenChartProps) => {
  const hasData = data && data.length > 0;

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
        />
      )}
    </SwapTokenChartWrapper>
  );
};

export default SwapTokenChart;
