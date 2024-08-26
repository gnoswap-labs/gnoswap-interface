import dayjs from "dayjs";
import React, { useCallback, useMemo, useState } from "react";

import { CHART_TYPE } from "@constants/option.constant";
import { useLoading } from "@hooks/common/use-loading";
import { useGetDashboardVolume } from "@query/dashboard";
import { formatOtherPrice } from "@utils/new-number-utils";

import VolumeChart, {
  VolumeChartInfo,
} from "../../components/volume-chart/VolumeChart";

const parseDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("MMM D, YYYY");
};

const VolumeChartContainer: React.FC = () => {
  const { isLoading: isLoadingCommon } = useLoading();

  const [volumeChartType, setVolumeChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: volumeEntity, isLoading } = useGetDashboardVolume();

  const {
    volume: volumeData,
    allTimeVolumeUsd,
    allTimeFeeUsd,
    fee,
  } = volumeEntity || {};
  const changeVolumeChartType = useCallback(
    ({ key: newType }: { display: string; key: string }) => {
      const volumeChartType =
        Object.values(CHART_TYPE).find(type => type === newType) ||
        CHART_TYPE["7D"];
      setVolumeChartType(volumeChartType);
    },
    [],
  );
  const chartData = useMemo(() => {
    if (!volumeData?.all)
      return {
        xAxisLabels: [],
        datas: [],
        times: [],
        fees: [],
      } as VolumeChartInfo;
    let chartData = volumeData?.last7d;
    let feeData = fee?.last7d;

    switch (volumeChartType) {
      case "30D":
        chartData = volumeData?.last30d;
        feeData = fee?.last30d;
        break;
      case "90D":
        chartData = volumeData?.last90d;
        feeData = fee?.last90d;
        break;
      case "ALL":
        chartData = volumeData?.all;
        feeData = fee?.all;
        break;
      case "7D":
      default:
        chartData = volumeData?.last7d;
        feeData = fee?.last7d;
        break;
    }

    const fees = (feeData || [])
      ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((pre, next) => {
        return [...pre, next.feeUsd];
      }, [] as string[]);

    return chartData
      ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce(
        (pre, next) => {
          const time = parseDate(next.date);
          return {
            xAxisLabels: [...pre.xAxisLabels, time],
            datas: [...pre.datas, next.volumeUsd],
            times: [...pre.times, next.date],
            fees: fees,
          };
        },
        { xAxisLabels: [], datas: [], times: [], fees: [] } as VolumeChartInfo,
      );
  }, [fee, volumeChartType, volumeData]);

  return (
    <VolumeChart
      volumeChartType={volumeChartType}
      changeVolumeChartType={changeVolumeChartType}
      volumePriceInfo={{
        amount: formatOtherPrice(allTimeVolumeUsd, {
          isKMB: false,
        }),
        fee: formatOtherPrice(allTimeFeeUsd, {
          isKMB: false,
        }),
      }}
      volumeChartInfo={chartData}
      loading={isLoading || isLoadingCommon}
    />
  );
};

export default VolumeChartContainer;
