import React, { useCallback, useState, useMemo } from "react";
import TvlChart from "@components/dashboard/tvl-chart/TvlChart";
import { CHART_TYPE } from "@constants/option.constant";
import dayjs from "dayjs";
import { toPriceFormat } from "@utils/number-utils";
import { useLoading } from "@hooks/common/use-loading";
import { getLocalizeTime } from "@utils/chart";
import { useGetDashboardTVL } from "@query/dashboard";

export interface TvlPriceInfo {
  amount: string;
}

export const TvlChartGraphPeriods = ["1D", "7D", "1M", "1Y", "ALL"] as const;
export type TvlChartGraphPeriodType = (typeof TvlChartGraphPeriods)[number];

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

const parseDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("MMM D, YYYY");
};

// const generateData = (chartType: CHART_TYPE) => {
//   const mappingLength: Record<CHART_TYPE, number> = {
//     [CHART_TYPE["7D"]]: 7,
//     [CHART_TYPE["1M"]]: 30,
//     [CHART_TYPE["1Y"]]: 90,
//     [CHART_TYPE["ALL"]]: 356,
//   };

//   return Array.from({ length: mappingLength[chartType] }, (_, index) => {
//     const date = new Date();
//     date.setDate(date.getDate() - 1 * index);
//     return {
//       date: date.toISOString(),
//       price: `${Math.round(Math.random() * 5000000) + 100000000}`,
//     };
//   }).reverse();
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

// function createDummyAmountDatas(tvlChartType: CHART_TYPE) {
//   let length = 8;
//   if (CHART_TYPE["7D"] === tvlChartType) {
//     length = 8;
//   }
//   if (CHART_TYPE["1M"] === tvlChartType) {
//     length = 31;
//   }
//   if (CHART_TYPE["1Y"] === tvlChartType) {
//     length = 91;
//   }
//   if (CHART_TYPE["ALL"] === tvlChartType) {
//     length = 91;
//   }
//   return Array.from({ length }, (_, index) => {
//     const date = new Date();
//     date.setHours(date.getHours() - index);

//     return {
//       amount: {
//         value: `${Math.round(Math.random() * 5000000) + 100000000}`,
//         denom: "USD",
//       },
//       time: date.toString(),
//     };
//   }).reverse();
// }
// const initialTvlChartPriceInfo: TvlPriceInfo = {
//   amount: "$100,450,000",
// };

// async function fetchTvlPriceInfo(): Promise<TvlPriceInfo> {
//   return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
//     Promise.resolve({ amount: "1324.40" }),
//   );
// }

const TvlChartContainer: React.FC = () => {
  const { isLoading: isLoadingCommon } = useLoading();

  const [tvlChartType, setTvlChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: tvlData, isLoading } = useGetDashboardTVL({
    refetchInterval: 60 * 1000,
  });
  const changeTvlChartType = useCallback((newType: string) => {
    const tvlChartType =
      Object.values(CHART_TYPE).find(type => type === newType) ||
      CHART_TYPE["7D"];
    setTvlChartType(tvlChartType);
  }, []);
  const chartData = useMemo(() => {
    if (!tvlData?.all)
      return {
        xAxisLabels: [],
        datas: [],
      };
    let chartData = tvlData?.last7d;

    switch (tvlChartType) {
      case "30D":
        chartData = tvlData?.last30d;
        break;
      case "90D":
        chartData = tvlData?.last90d;
        break;
      case "ALL":
        chartData = tvlData?.all;
        break;
      case "7D":
      default:
        chartData = tvlData?.last7d;
        break;
    }

    return chartData?.reduce(
      (pre: any, next: any) => {
        const time = parseDate(next.date);
        return {
          xAxisLabels: [...pre.xAxisLabels, time],
          datas: [
            ...pre.datas,
            {
              amount: {
                value: next.tvlUsd || 0,
                denom: "USD",
              },
              time: getLocalizeTime(next.date),
            },
          ],
        };
      },
      { xAxisLabels: [], datas: [] } as TvlChartInfo,
    );
  }, [tvlChartType, tvlData]);

  return (
    <TvlChart
      tvlChartType={tvlChartType}
      changeTvlChartType={changeTvlChartType}
      tvlPriceInfo={{
        amount: tvlData?.latest
          ? `${toPriceFormat(tvlData?.latest, {
            isKMBFormat: false,
            usd: true,
            lestThan1Decimals: 1,
            greaterThan1Decimals: 1,
            forcedDecimals: true,
          })}`
          : "-",
      }}
      tvlChartInfo={chartData ?? { xAxisLabels: [], datas: [] }}
      loading={isLoading || isLoadingCommon}
    />
  );
};

export default TvlChartContainer;
