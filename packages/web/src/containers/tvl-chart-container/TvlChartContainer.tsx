import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TvlChart from "@components/dashboard/tvl-chart/TvlChart";
import { CHART_TYPE } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TvlResponse } from "@repositories/dashboard";
import dayjs from "dayjs";
import { prettyNumber } from "@utils/number-utils";

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

const generateData = (chartType: CHART_TYPE) => {
  const mappingLength: Record<CHART_TYPE, number> = {
    [CHART_TYPE["7D"]]: 7,
    [CHART_TYPE["1M"]]: 30,
    [CHART_TYPE["1Y"]]: 365,
    [CHART_TYPE["ALL"]]: 400,
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
  const [loading, setLoading] = useState(true);
  const { dashboardRepository } = useGnoswapContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const [tvlChartType, setTvlChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: tvlData, isFetching } = useQuery<TvlResponse, Error>({
    queryKey: ["dashboardTvl"],
    queryFn: dashboardRepository.getDashboardTvl,
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
    let chartData = tvlData?.last_7d;

    switch (tvlChartType) {
      case "1M":
        chartData = tvlData?.last_1m;
        break;
      case "1Y":
        chartData = tvlData?.last_1y;
        break;
      case "ALL":
        chartData = tvlData?.all;
        break;
      default:
        chartData = tvlData?.last_7d;
        break;
    }

    return generateData(tvlChartType ?? "7D")?.reduce(
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
              time,
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
        amount: tvlData?.latest ? `$${prettyNumber(tvlData?.latest)}` : "-",
      }}
      tvlChartInfo={chartData}
      loading={loading || isFetching}
    />
  );
};

export default TvlChartContainer;
