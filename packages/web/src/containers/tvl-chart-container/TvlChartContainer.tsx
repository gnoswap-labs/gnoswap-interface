import React, { useCallback, useState, useMemo } from "react";
import TvlChart from "@components/dashboard/tvl-chart/TvlChart";
import { CHART_TYPE } from "@constants/option.constant";
import { useLoading } from "@hooks/common/use-loading";
import { getLocalizeTime } from "@utils/chart";
import { useGetDashboardTVL } from "@query/dashboard";
import { formatOtherPrice } from "@utils/new-number-utils";

export interface TvlPriceInfo {
  amount: string;
}

export const TvlChartGraphPeriods = ["1D", "7D", "1M", "1Y", "ALL"] as const;
export type TvlChartGraphPeriodType = (typeof TvlChartGraphPeriods)[number];

export type TvlChartData = {
  amount: {
    value: string;
    denom: string;
  };
  time: string;
}[];

const TvlChartContainer: React.FC = () => {
  const { isLoading: isLoadingCommon } = useLoading();

  const [tvlChartType, setTvlChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: tvlData, isLoading } = useGetDashboardTVL({
    refetchInterval: 60 * 1000,
  });
  const changeTvlChartType = useCallback(
    ({ key: newType }: { display: string; key: string }) => {
      const tvlChartType =
        Object.values(CHART_TYPE).find(type => type === newType) ||
        CHART_TYPE["7D"];
      setTvlChartType(tvlChartType);
    },
    [],
  );
  const chartData = useMemo(() => {
    if (!tvlData?.all) return [];
    let currentChartData = tvlData?.last7d;

    switch (tvlChartType) {
      case "30D":
        currentChartData = tvlData?.last30d;
        break;
      case "90D":
        currentChartData = tvlData?.last90d;
        break;
      case "ALL":
        currentChartData = tvlData?.all;
        break;
      case "7D":
      default:
        currentChartData = tvlData?.last7d;
        break;
    }

    return currentChartData?.reduce((pre: any, next: any) => {
      return [
        ...pre,
        {
          amount: {
            value: next.tvlUsd || 0,
            denom: "USD",
          },
          time: getLocalizeTime(next.date),
        },
      ];
    }, [] as TvlChartData);
  }, [tvlChartType, tvlData]);

  return (
    <TvlChart
      tvlChartType={tvlChartType}
      changeTvlChartType={changeTvlChartType}
      tvlPriceInfo={{
        amount: formatOtherPrice(tvlData?.latest, {
          isKMB: false,
        }),
      }}
      tvlChartDatas={chartData}
      loading={isLoading || isLoadingCommon}
    />
  );
};

export default TvlChartContainer;
