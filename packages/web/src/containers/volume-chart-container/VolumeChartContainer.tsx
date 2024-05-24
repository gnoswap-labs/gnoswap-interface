import React, { useCallback, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import VolumeChart from "@components/dashboard/volume-chart/VolumeChart";
import { CHART_TYPE } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import dayjs from "dayjs";
import { useLoading } from "@hooks/common/use-loading";
import { toPriceFormat, toUnitFormat } from "@utils/number-utils";
import { IVolumeResponse } from "@repositories/dashboard/response/volume-response";

export interface VolumePriceInfo {
  amount: string;
  fee: string;
}

export interface VolumeChartInfo {
  datas: string[];
  xAxisLabels: string[];
  times: string[];
}

const parseDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("MMM D, YYYY");
};

// const generateData = (chartType: CHART_TYPE) => {
//   const mappingLength: Record<CHART_TYPE, number> = {
//     [CHART_TYPE["7D"]]: 7,
//     [CHART_TYPE["1M"]]: 30,
//     [CHART_TYPE["1Y"]]: 90,
//     [CHART_TYPE["ALL"]]: 90,
//   };

//   return Array.from({ length: mappingLength[chartType] }, (_, index) => {
//     const date = new Date(Date.now());
//     date.setDate(date.getDate() - 1 * index);
//     return {
//       date: date.toISOString(),
//       price: `${Math.round(Math.random() * 5000000) + 100000000}`,
//     };
//   }).reverse();
// };

// const initialVolumePriceInfo: VolumePriceInfo = {
//   amount: "$994,120,000",
//   fee: "$12,231",
// };
// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];
// function createXAxisDummyDatas(currentTab: CHART_TYPE) {
//   const now = Date.now();
//   switch (currentTab) {
//     case "7D":
//       return Array.from({ length: 8 }, (_, index) => {
//         const date = new Date(now);
//         date.setDate(date.getDate() - 1 * index);
//         const monthStr = months[date.getMonth()];
//         const dayStr = `${date.getDate()}`.padStart(2, "0");
//         const yearStr = date.getFullYear();
//         return `${monthStr} ${dayStr}, ${yearStr}`;
//       }).reverse();
//     case "1M":
//       return Array.from({ length: 8 }, (_, index) => {
//         const date = new Date(now);
//         date.setMonth(date.getMonth() - 1 * index);
//         const monthStr = months[date.getMonth()];
//         const dayStr = `${date.getDate()}`.padStart(2, "0");
//         const yearStr = date.getFullYear();

//         return `${monthStr} ${dayStr}, ${yearStr}`;
//       }).reverse();
//     case "1Y":
//       return Array.from({ length: 8 }, (_, index) => {
//         const date = new Date(now);
//         date.setFullYear(date.getFullYear() - 1 * index);
//         const monthStr = months[date.getMonth()];
//         const dayStr = `${date.getDate()}`.padStart(2, "0");
//         const yearStr = date.getFullYear();

//         return `${monthStr} ${dayStr}, ${yearStr}`;
//       }).reverse();
//     case "ALL":
//     default:
//       return Array.from({ length: 10 }, (_, index) => {
//         const date = new Date(now);
//         date.setMonth(date.getMonth() - 1 * index);
//         const monthStr = months[date.getMonth()];
//         const dayStr = `${date.getDate()}`.padStart(2, "0");
//         const yearStr = date.getFullYear();

//         return `${monthStr} ${dayStr}, ${yearStr}`;
//       }).reverse();
//   }
// }

// function createDummyAmountDatas(volumeChartType: CHART_TYPE) {
//   let length = 8;
//   if (CHART_TYPE["7D"] === volumeChartType) {
//     length = 8;
//   }
//   if (CHART_TYPE["1M"] === volumeChartType) {
//     length = 31;
//   }
//   if (CHART_TYPE["1Y"] === volumeChartType) {
//     length = 91;
//   }
//   if (CHART_TYPE["ALL"] === volumeChartType) {
//     length = 91;
//   }
//   return Array.from({ length }, (_, index) => {
//     const date = new Date();
//     date.setHours(date.getHours() - index);
//     return {
//       amount: `${Math.round(Math.random() * 10000000) + 10000000}`,
//       time: date.toString(),
//     };
//   });
// }

// async function fetchVolumePriceInfo(): Promise<VolumePriceInfo> {
//   return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
//     Promise.resolve({ amount: "$100,450,000", fee: "$12,232" }),
//   );
// }

const VolumeChartContainer: React.FC = () => {
  const { dashboardRepository } = useGnoswapContext();
  const { isLoadingCommon } = useLoading();

  const [volumeChartType, setVolumeChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: volumeEntity, isLoading } = useQuery<IVolumeResponse, Error>({
    queryKey: ["volumePriceInfo"],
    queryFn: dashboardRepository.getDashboardVolume,
    refetchInterval: 60 * 1000,
  });
  const { volume: volumeData, allTimeVolumeUsd, allTimeFeeUsd } = volumeEntity || {};
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
      } as VolumeChartInfo;
    let chartData = volumeData?.last7d;

    switch (volumeChartType) {
      case "30D":
        chartData = volumeData?.last30d;
        break;
      case "90D":
        chartData = volumeData?.last90d;
        break;
      case "ALL":
        chartData = volumeData?.all;
        break;
      case "7D":
      default:
        chartData = volumeData?.last7d;
        break;
    }

    return chartData?.sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime()).reduce(
      (pre, next) => {
        const time = parseDate(next.date);
        return {
          xAxisLabels: [...pre.xAxisLabels, time],
          datas: [...pre.datas, next.volumeUsd],
          times: [...pre.times, time],
        };
      },
      { xAxisLabels: [], datas: [], times: [] } as VolumeChartInfo,
    );
  }, [volumeChartType, volumeData]);

  console.log("🚀 ~ allTimeVolumeUsd:", allTimeVolumeUsd);


  return (
    <VolumeChart
      volumeChartType={volumeChartType}
      changeVolumeChartType={changeVolumeChartType}
      volumePriceInfo={{
        amount: allTimeVolumeUsd
          ? toPriceFormat(Number(allTimeVolumeUsd), { usd: true, isRounding: false, isFormat: false })
          : "-",
        fee: allTimeFeeUsd
          ? toUnitFormat(Number(allTimeFeeUsd), true, false, false)
          : "-",
      }}
      volumeChartInfo={chartData}
      loading={isLoading || isLoadingCommon}
    />
  );
};

export default VolumeChartContainer;
