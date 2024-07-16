import React, { useCallback, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import VolumeChart from "@components/dashboard/volume-chart/VolumeChart";
import { CHART_TYPE } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import dayjs from "dayjs";
import { useLoading } from "@hooks/common/use-loading";
import { IVolumeResponse } from "@repositories/dashboard/response/volume-response";
import { formatOtherPrice } from "@utils/new-number-utils";

export interface VolumePriceInfo {
  amount: string;
  fee: string;
}

export interface VolumeChartInfo {
  datas: string[];
  xAxisLabels: string[];
  times: string[];
  fees: string[];
}

const parseDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("MMM D, YYYY");
};

const VolumeChartContainer: React.FC = () => {
  const { dashboardRepository } = useGnoswapContext();
  const { isLoading: isLoadingCommon } = useLoading();

  const [volumeChartType, setVolumeChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: volumeEntity, isLoading } = useQuery<IVolumeResponse, Error>({
    queryKey: ["volumePriceInfo"],
    queryFn: dashboardRepository.getDashboardVolume,
    refetchInterval: 60 * 1000,
  });

  const {
    volume: volumeData,
    allTimeVolumeUsd,
    allTimeFeeUsd,
    fee,
  } = volumeEntity || {};
  const changeVolumeChartType = useCallback((newType: string) => {
    const volumeChartType =
      Object.values(CHART_TYPE).find(type => type === newType) ||
      CHART_TYPE["7D"];
    setVolumeChartType(volumeChartType);
  }, []);
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
          decimals: 1,
        }),
        fee: formatOtherPrice(allTimeFeeUsd, {
          decimals: 1,
          isKMB: false,
        }),
      }}
      volumeChartInfo={chartData}
      loading={isLoading || isLoadingCommon}
    />
  );
};

export default VolumeChartContainer;
