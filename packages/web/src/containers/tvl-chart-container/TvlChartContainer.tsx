import React, { useCallback, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TvlChart from "@components/dashboard/tvl-chart/TvlChart";
import { CHART_TYPE } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TvlResponse } from "@repositories/dashboard";
import dayjs from "dayjs";
import { prettyNumber, removeTrailingZeros } from "@utils/number-utils";
import { useLoading } from "@hooks/common/use-loading";
import { getLabelChart, getLocalizeTime, getNumberOfAxis, getPaddingLeftAndRight } from "@utils/chart";
import useComponentSize from "@hooks/common/use-component-size";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

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

const getChartData = (tvlChartType: CHART_TYPE, tvlData: any) => {
  let data = [];
  switch (tvlChartType) {
    case "30D":
      data = tvlData?.last_1m || [];
    case "90D":
      data = tvlData?.last_1y || [];
    case "ALL":
      data = tvlData?.all || [];
    default:
      data = tvlData?.last_7d || [];
  }
  return data.map((item: any) => ({
    item,
    date: getLocalizeTime(item.date)
  }));
};
const MINUTES = {
  "7D" : 60,
  "30D": 240,
  "90D": 1440,
  "ALL": 1440,
};

const TvlChartContainer: React.FC = () => {
  const { dashboardRepository } = useGnoswapContext();
  const { isLoadingCommon } = useLoading();
  const [tvlChartType, setTvlChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: tvlData, isLoading } = useQuery<TvlResponse, Error>({
    queryKey: ["dashboardTvl"],
    queryFn: dashboardRepository.getDashboardTvl,
    refetchInterval: 60 * 1000,
  });
  const [componentRef, size] = useComponentSize(isLoading || isLoadingCommon);
  const { breakpoint } = useWindowSize();
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
    let chartData = tvlData?.last_7d;

    chartData = getChartData(tvlChartType, tvlData);

    return chartData?.reduce(
      (pre, next) => {
        const time = parseDate(next.date);
        return {
          xAxisLabels: [...pre.xAxisLabels, time],
          datas: [
            ...pre.datas,
            {
              amount: {
                value: next.price,
                denom: "USD",
              },
              time: next.date,
            },
          ],
        };
      },
      { xAxisLabels: [], datas: [] } as TvlChartInfo,
    );
  }, [tvlChartType, tvlData]);
  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor(((size.width || 0) + 20 - 25) / 100);
    return Math.floor(((size.width || 0) + 20 - 8) / 80);
  }, [size.width, breakpoint]);
  const chart = getChartData(tvlChartType, tvlData) || [];
  const padding = getPaddingLeftAndRight(chart || [], size.width, MINUTES[tvlChartType as "7D" | "30D" | "90D" | "ALL"]);
  const numberOfAxis = getNumberOfAxis(chart.length - padding.countFirstDay - padding.countLastDay, countXAxis, 3);
  const uniqueDates = [
    ...new Set(chart.slice(padding.countFirstDay, -padding.countLastDay).map((entry: any) => entry.date.split(" ")[0])),
  ];
  const label = getLabelChart(uniqueDates, numberOfAxis);
  console.log(label);
  return (
    <TvlChart
      tvlChartType={tvlChartType}
      changeTvlChartType={changeTvlChartType}
      tvlPriceInfo={{
        amount: tvlData?.latest ? `$${removeTrailingZeros(prettyNumber(tvlData?.latest))}` : "-",
      }}
      tvlChartInfo={chartData}
      loading={isLoading || isLoadingCommon}
      componentRef={componentRef}
      size={size}
    />
  );
};

export default TvlChartContainer;
