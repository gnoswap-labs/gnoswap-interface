import React, { useCallback, useState, useEffect, useMemo } from "react";
import TokenChart from "@components/token/token-chart/TokenChart";
import { useRouter } from "next/router";
import { IPriceResponse, IPrices1d } from "@repositories/token";
import { TokenModel } from "@models/token/token-model";
import { useAtom } from "jotai";
import { TokenState } from "@states/index";
import { useTokenTradingModal } from "@hooks/swap/use-token-trading-modal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useComponentSize from "@hooks/common/use-component-size";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import {
  checkPositivePrice,
  countPoints,
  generateDateSequence,
} from "@utils/common";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGetTokenDetailByPath, useGetTokensList } from "@query/token";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export const TokenChartGraphPeriods = ["1D", "7D", "1M", "1Y", "ALL"] as const;
export type TokenChartGraphPeriodType = (typeof TokenChartGraphPeriods)[number];

const getXaxis1Day = (data: Date[], numberAxis: number): string[] => {
  console.log(numberAxis);

  const rs: string[] = [];
  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  for (const entry of data) {
    const data = new Date(entry).toLocaleTimeString("en-US", formatOptions);
    rs.push(data);
  }
  return rs;
};

const getXaxis1M = (data: IPrices1d[], numberAxis: number): string[] => {
  if (data.length > 0) {
    const lastDate = new Date(data[0].date);
    const firstDate = new Date(data[data.length - 1].date);
    const timeDifference = lastDate.getTime() - firstDate.getTime();
    const interval = timeDifference / numberAxis;

    const points: string[] = [];

    for (let i = 0; i <= numberAxis - 1; i++) {
      const pointTime = firstDate.getTime() + i * interval;
      const pointDate = new Date(pointTime);
      pointDate.setDate(pointDate.getDate());
      const monthStr = months[pointDate.getMonth()];
      const dayStr = `${pointDate.getDate()}`.padStart(2, "0");
      const yearStr = pointDate.getFullYear();
      const str = `${monthStr} ${dayStr}, ${yearStr}`;
      points.push(str);
    }
    return points.reverse();
  }
  return [];
};

export interface TokenInfo {
  token: {
    name: string;
    symbol: string;
    image: string;
    pkg_path: string;
    decimals: number;
    description: string;
    website_url: string;
  };
  priceInfo: {
    amount: {
      value: number | string;
      denom: string;
      status: MATH_NEGATIVE_TYPE;
    };
    changedRate: number;
  };
}
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export interface ChartInfo {
  xAxisLabels: string[];
  yAxisLabels: string[];
  left: number;
  right: number;
  datas: {
    amount: {
      value: string;
      denom: string;
    };
    time: string;
  }[];
}

const dummyTokenInfo: TokenInfo = {
  token: {
    name: "Gnoswap",
    symbol: "GNS",
    image: "/gnos.svg",
    pkg_path: "string",
    decimals: 1,
    description: "string",
    website_url: "string",
  },
  priceInfo: {
    amount: {
      value: 0.9844,
      denom: "USD",
      status: MATH_NEGATIVE_TYPE.NONE,
    },
    changedRate: 7.43,
  },
};

function createXAxisDatas(
  currentTab: TokenChartGraphPeriodType,
  chartData: IPrices1d[],
  numberAxis: number,
  date: Date[],
) {
  const now = Date.now();
  const uniqueDates = [
    ...new Set(chartData.map(entry => entry.date.split(" ")[0])),
  ];
  const uniqueMonths = [
    ...new Set(
      chartData.map(item =>
        new Date(item.date).toLocaleString("default", { month: "long" }),
      ),
    ),
  ];
  const uniqueYears = [
    ...new Set(chartData.map(item => new Date(item.date).getFullYear())),
  ];

  switch (currentTab) {
    case "1D":
      return getXaxis1Day(date, numberAxis - 2);
    case "7D":
      return Array.from(
        { length: Math.min(numberAxis, uniqueDates.length) },
        (_, index) => {
          const date = new Date(now);
          date.setDate(date.getDate() - 1 * index);
          const monthStr = months[date.getMonth()];
          const dayStr = `${date.getDate()}`.padStart(2, "0");
          const yearStr = date.getFullYear();
          return `${monthStr} ${dayStr}, ${yearStr}`;
        },
      ).reverse();
    case "1M":
      return getXaxis1M(chartData, Math.min(numberAxis, uniqueDates.length));
    case "1Y":
      return Array.from(
        { length: Math.min(uniqueMonths.length, numberAxis) },
        (_, index) => {
          const date = new Date(now);
          date.setMonth(date.getMonth() - 1 * index);
          const monthStr = months[date.getMonth()];
          const dayStr = `${date.getDate()}`.padStart(2, "0");
          const yearStr = date.getFullYear();
          return `${monthStr} ${dayStr}, ${yearStr}`;
        },
      ).reverse();
    case "ALL":
    default:
      return Array.from(
        { length: Math.min(uniqueYears.length, numberAxis) },
        (_, index) => {
          const date = new Date(now);
          date.setFullYear(date.getFullYear() - 1 * index);
          const monthStr = months[date.getMonth()];
          const dayStr = `${date.getDate()}`.padStart(2, "0");
          const yearStr = date.getFullYear();
          return `${monthStr} ${dayStr}, ${yearStr}`;
        },
      ).reverse();
  }
}

const priceChangeDetailInit = {
  latestPrice: "",
  priceToday: "",
  price1h: "",
  price2h: "",
  price1d: "",
  price2d: "",
  price7d: "",
  price8d: "",
  price30d: "",
  price31d: "",
  price60d: "",
  price61d: "",
  price90d: "",
  price91d: "",
};

const TokenChartContainer: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>(dummyTokenInfo);
  const [currentTab, setCurrentTab] = useState<TokenChartGraphPeriodType>("1D");
  const router = useRouter();
  const [fromSelectToken, setFromSelectToken] = useAtom(
    TokenState.fromSelectToken,
  );
  const clearModal = useClearModal();
  const { breakpoint } = useWindowSize();
  const { gnot, wugnotPath } = useGnotToGnot();

  const { openModal: openTradingModal } = useTokenTradingModal({
    onClickConfirm: () => {
      setFromSelectToken(false);
      clearModal();
    },
  });
  const { data: { tokens = [] } = {} } = useGetTokensList();
  const {
    data: {
      prices1d = [],
      prices7d = [],
      prices1m = [],
      prices1y = [],
      pricesBefore = priceChangeDetailInit,
      currentPrice = "",
    } = {},
    isLoading,
  } = useGetTokenDetailByPath(
    router.query["tokenB"] === "gnot"
      ? wugnotPath
      : (router.query["tokenB"] as string),
    { enabled: !!router.query["tokenB"] },
  );
  const [componentRef, size] = useComponentSize(isLoading);

  useEffect(() => {
    const currentToken: TokenModel = tokens.filter(
      (item: TokenModel) => item.symbol === router.query["token-path"],
    )[0];
    if (currentToken) {
      const dataToday = checkPositivePrice(
        pricesBefore.latestPrice,
        pricesBefore.priceToday,
        19,
      );
      setTokenInfo(() => ({
        token: {
          name: currentToken.name,
          symbol: currentToken.symbol,
          image: currentToken.logoURI,
          pkg_path: currentToken.path,
          decimals: 1,
          description: currentToken.description || "",
          website_url: currentToken.websiteURL || "",
        },
        priceInfo: {
          amount: {
            value: currentPrice ? Number(currentPrice) : "",
            denom: "USD",
            status: dataToday.status,
          },
          changedRate: Math.abs(Number(dataToday.value || 0)),
        },
      }));
      if (!fromSelectToken && !currentToken.logoURI) {
        openTradingModal({
          symbol: currentToken.symbol,
          path: currentToken.path,
        });
      }
    }
  }, [router.query, pricesBefore.toString(), currentPrice, tokens, gnot]);

  const changeTab = useCallback((tab: string) => {
    const currentTab =
      TokenChartGraphPeriods.find(period => `${period}` === tab) || "1D";
    setCurrentTab(currentTab);
  }, []);

  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor(
        ((size.width || 0) + 20 - 25) /
          (currentTab === TokenChartGraphPeriods[0] ? 60 : 100),
      );
    return Math.floor(((size.width || 0) + 20 - 8) / 80);
  }, [size.width, breakpoint, currentTab]);

  const chartData = useMemo(() => {
    if (currentTab === TokenChartGraphPeriods[0]) {
      return prices1d || [];
    }
    if (currentTab === TokenChartGraphPeriods[1]) {
      return prices7d || [];
    }
    if (currentTab === TokenChartGraphPeriods[2]) {
      return prices1m || [];
    }
    if (currentTab === TokenChartGraphPeriods[3]) {
      return prices1y || [];
    }
    return prices1y || [];
  }, [
    prices1d?.toString(),
    prices7d?.toString,
    prices1m?.toString(),
    prices1y?.toString(),
    currentTab,
  ]);

  const getChartInfo = useCallback(() => {
    const temp = generateDateSequence(
      chartData?.[0]?.date,
      chartData[chartData?.length - 1]?.date,
    );
    let left = 0;
    let right = 0;
    if (
      temp.length > 1 &&
      chartData.length > 1 &&
      currentTab === TokenChartGraphPeriods[0]
    ) {
      left = countPoints(chartData[0].date, temp[0].toLocaleString(), 10) - 1;
      right = countPoints(
        temp[temp.length - 1].toLocaleString(),
        chartData[chartData.length - 1].date,
        10,
      );
    }
    const xAxisLabels = createXAxisDatas(
      currentTab,
      chartData,
      countXAxis,
      temp,
    );

    const length =
      currentTab === TokenChartGraphPeriods[0]
        ? 144
        : currentTab === TokenChartGraphPeriods[1]
        ? 168
        : currentTab === TokenChartGraphPeriods[2]
        ? 180
        : currentTab === TokenChartGraphPeriods[3]
        ? 365
        : 144;

    const datas =
      chartData?.length > 0
        ? chartData.slice(0, length).map((item: IPriceResponse) => {
            return {
              amount: {
                value: `${item.price}`,
                denom: "",
              },
              time: item.date,
            };
          })
        : [];
    const yAxisLabels = getYAxisLabels(
      datas.map(item => Number(item.amount.value).toFixed(2)),
    );
    const chartInfo: ChartInfo = {
      xAxisLabels,
      yAxisLabels,
      datas: datas,
      left: left,
      right: right,
    };

    return chartInfo;
  }, [currentTab, chartData?.toString(), countXAxis]);

  const getYAxisLabels = (datas: string[]): string[] => {
    const convertNumber = datas.map(item => Number(item));
    const minPoint = Math.min(...convertNumber);
    const maxPoint = Math.max(...convertNumber);
    const temp = [minPoint.toString()];
    const space = Number(Number((maxPoint - minPoint) / 6).toFixed(2));
    for (let i = 0; i < 5; i++) {
      temp.push(`${(Number(temp[0]) + space * (i + 1)).toFixed(2)}`);
    }
    temp.push(maxPoint.toString());
    return temp;
  };

  return (
    <TokenChart
      tokenInfo={tokenInfo}
      chartInfo={getChartInfo()}
      currentTab={currentTab}
      changeTab={changeTab}
      loading={isLoading}
      componentRef={componentRef}
      size={size}
      breakpoint={breakpoint}
    />
  );
};

export default TokenChartContainer;