import React, { useCallback, useMemo, useState } from "react";

import { CHART_TYPE } from "@constants/option.constant";
import { useLoading } from "@hooks/common/use-loading";
import { useGetDashboardTVL } from "@query/dashboard";
import { TvlData } from "@repositories/dashboard";
import { getLocalizeTime } from "@utils/chart";
import { formatOtherPrice } from "@utils/new-number-utils";

import TvlChart, { TvlChartData } from "../../components/tvl-chart/TvlChart";

export const TvlChartGraphPeriods = ["1D", "7D", "1M", "1Y", "ALL"] as const;
export type TvlChartGraphPeriodType = (typeof TvlChartGraphPeriods)[number];

const TvlChartContainer: React.FC = () => {
  const { isLoading: isLoadingCommon } = useLoading();

  const [tvlChartType, setTvlChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: tvlData, isLoading } = useGetDashboardTVL();
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

    return currentChartData?.reduce<TvlChartData>(
      (accum: TvlChartData, current: TvlData) => {
        return [
          ...accum,
          {
            amount: {
              value: current.tvlUsd || "0",
              denom: "USD",
            },
            time: getLocalizeTime(current.date),
          },
        ];
      },
      [],
    );
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
