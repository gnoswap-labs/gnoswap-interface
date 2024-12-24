import React from "react";

import { IPriceResponse } from "@repositories/token";
import { getLocalizeTime } from "@utils/chart";

import LineGraph from "@components/common/line-graph/LineGraph";
import { SwapTokenChartWrapper } from "./SwapTokenChart.styles";

interface SwapTokenChartProps {
  data: IPriceResponse[];
}

const SwapTokenChart = ({ data = [] }: SwapTokenChartProps) => {
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
      <div>
        <LineGraph datas={chartData} width={400} height={50} color="#192EA2" strokeWidth={1} cursor smooth />
      </div>
    </SwapTokenChartWrapper>
  );
};

export default SwapTokenChart;
