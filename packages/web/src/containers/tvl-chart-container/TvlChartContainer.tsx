import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TvlChart from "@components/dashboard/tvl-chart/TvlChart";
import { CHART_TYPE } from "@constants/option.constant";

export interface TvlPriceInfo {
  amount: string;
}

const initialTvlChartPriceInfo: TvlPriceInfo = {
  amount: "$100,450,000",
};

async function fetchTvlPriceInfo(): Promise<TvlPriceInfo> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    Promise.resolve({ amount: "1324.40" }),
  );
}

const TvlChartContainer: React.FC = () => {
  const [tvlChartType, setTvlChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: tvlPriceInfo } = useQuery<TvlPriceInfo, Error>({
    queryKey: ["tvlPriceInfo"],
    queryFn: () => fetchTvlPriceInfo(),
    initialData: initialTvlChartPriceInfo,
  });

  const changeTvlChartType = useCallback((newType: string) => {
    const tvlChartType =
      Object.values(CHART_TYPE).find(type => type === newType) ||
      CHART_TYPE["7D"];
    setTvlChartType(tvlChartType);
  }, []);

  return (
    <TvlChart
      tvlChartType={tvlChartType}
      changeTvlChartType={changeTvlChartType}
      tvlPriceInfo={tvlPriceInfo}
    />
  );
};

export default TvlChartContainer;
