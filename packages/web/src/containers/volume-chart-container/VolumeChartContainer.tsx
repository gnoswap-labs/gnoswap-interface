import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import VolumeChart from "@components/dashboard/volume-chart/VolumeChart";
import { CHART_TYPE } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { VolumeResponse } from "@repositories/dashboard/response/volume-response";
import dayjs from "dayjs";

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

const generateData = (chartType: CHART_TYPE) => {
  const mappingLength: Record<CHART_TYPE, number> = {
    [CHART_TYPE["7D"]]: 7,
    [CHART_TYPE["1M"]]: 30,
    [CHART_TYPE["1Y"]]: 90,
    [CHART_TYPE["ALL"]]: 90,
  };

  return Array.from({ length: mappingLength[chartType] }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 1 * index);
    return {
      date: date.toISOString(),
      price: `${Math.round(Math.random() * 5000000) + 100000000}`,
    };
  });
};

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
  const [loading, setLoading] = useState(true);
  const { dashboardRepository } = useGnoswapContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const [volumeChartType, setVolumeChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: volumeData, isFetching } = useQuery<VolumeResponse, Error>({
    queryKey: ["volumePriceInfo"],
    queryFn: dashboardRepository.getDashboardVolume,
  });

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
    let chartData = volumeData?.last_7d;

    switch (volumeChartType) {
      case "1M":
        chartData = volumeData?.last_1m;
        break;
      case "1Y":
        chartData = volumeData?.last_1y;
        break;
      case "ALL":
        chartData = volumeData?.all;
        break;
      default:
        chartData = volumeData?.last_7d;
        break;
    }

    console.log(chartData);

    return generateData(volumeChartType)?.reduce(
      (pre, next) => {
        const time = parseDate(next.date);
        return {
          xAxisLabels: [...pre.xAxisLabels, time],
          datas: [...pre.datas, next.price],
          times: [...pre.times, time],
        };
      },
      { xAxisLabels: [], datas: [], times: [] } as VolumeChartInfo,
    );
  }, [volumeChartType, volumeData]);

  return (
    <VolumeChart
      volumeChartType={volumeChartType}
      changeVolumeChartType={changeVolumeChartType}
      volumePriceInfo={{
        amount: volumeData?.latest
          ? `$${Number(volumeData?.latest).toLocaleString()}`
          : "-",
        fee: volumeData?.fee
          ? `$${Number(volumeData?.fee).toLocaleString()}`
          : "-",
      }}
      volumeChartInfo={chartData}
      loading={loading || isFetching}
    />
  );
};

export default VolumeChartContainer;
