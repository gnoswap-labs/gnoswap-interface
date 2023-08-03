import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TvlChart from "@components/dashboard/tvl-chart/TvlChart";
import { CHART_TYPE } from "@constants/option.constant";

export interface TvlPriceInfo {
  amount: string;
}

export interface TvlChartInfo {
  xAxisLabels: string[];
  datas: {
    amount: {
      value: string;
      denom: string;
    };
    time: string;
  }[];
}

function createXAxisDummyDatas(currentTab: CHART_TYPE) {
  const now = Date.now();
  switch (currentTab) {
    case "7D":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setDate(date.getDate() - 1 * index);
        const monthStr = `${date.getMonth() + 1}`.padStart(2, "0");
        const dateStr = `${date.getDate()}`.padStart(2, "0");
        return `${monthStr}-${dateStr}`;
      }).reverse();
    case "1M":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const yearStr = date.getFullYear();
        const monthStr = `${date.getMonth() + 1}`.padStart(2, "0");
        return `${yearStr}-${monthStr}`;
      }).reverse();
    case "1Y":
    case "YTD":
    default:
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - 1 * index);
        const yearStr = date.getFullYear();
        return `${yearStr}`;
      }).reverse();
  }
}

function createDummyAmountDatas() {
  const length = 24;
  return Array.from({ length }, (_, index) => {
    const date = new Date();
    date.setHours(date.getHours() - index);

    return {
      amount: {
        value: `${Math.round(Math.random() * 500) + 1000}`,
        denom: "USD"
      },
      time: date.toString()
    };
  }).reverse();
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

  const getXAxisLabels = (tvlChartType: CHART_TYPE): string[] => {
    return createXAxisDummyDatas(tvlChartType);
  };

  const getChartInfo = useCallback(() => {
    const xAxisLabels = getXAxisLabels(tvlChartType);

    const datas = createDummyAmountDatas();

    const chartInfo: TvlChartInfo = {
      xAxisLabels,
      datas: datas,
    };

    return chartInfo;
  }, [tvlChartType]);

  return (
    <TvlChart
      tvlChartType={tvlChartType}
      changeTvlChartType={changeTvlChartType}
      tvlPriceInfo={tvlPriceInfo}
      tvlChartInfo={getChartInfo()}
    />
  );
};

export default TvlChartContainer;
