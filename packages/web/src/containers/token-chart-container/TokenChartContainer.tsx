import React, { useCallback, useState, useEffect, useMemo } from "react";
import TokenChart from "@components/token/token-chart/TokenChart";
import { useRouter } from "next/router";
import { useGetTokenDetailByPath, useGetTokensList } from "src/react-query/token";
import { IPriceResponse, IPrices1d } from "@repositories/token";
import { TokenModel } from "@models/token/token-model";
import { useAtom } from "jotai";
import { TokenState } from "@states/index";
import { useTokenTradingModal } from "@hooks/swap/use-token-trading-modal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { formatTime, generateRandomPoints } from "@common/utils/date-util";
import useComponentSize from "@hooks/common/use-component-size";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import { getChange } from "@containers/token-info-content-container/TokenInfoContentContainer";

export const TokenChartGraphPeriods = ["1D", "7D", "1M", "1Y", "ALL"] as const;
export type TokenChartGraphPeriodType = typeof TokenChartGraphPeriods[number];

function max(a: Date, b: Date): Date {
  return a > b ? a : b;
}

function min(a: Date, b: Date): Date {
  return a < b ? a : b;
}


const getXaxis1Day = (data: IPrices1d[], numberAxis: number) : string[] => {
  const temp: Date[] = [];
  const now = new Date();
  for (const entry of data) {
    temp.push(new Date(entry.date));
  }
  const rs: string[] = [];
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const expectFirstPoint = (max(temp[0], oneDayAgo));
  const expectLastPoint = (min(temp[temp.length - 1], tenMinutesAgo));
  const randomPoints = generateRandomPoints(expectFirstPoint, expectLastPoint, numberAxis);
  rs.push(formatTime(expectFirstPoint));
  for (const entry of randomPoints) {
    rs.push(formatTime(new Date(entry.date)));
  }
  rs.push(formatTime(expectLastPoint));
  return rs;
};

const getXaxis1M = (data: IPrices1d[], numberAxis: number) : string[] => {
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
};

export interface TokenInfo {
  token: {
    name: string;
    symbol: string;
    image: string;
    pkg_path: string
    decimals: number
    description: string
    website_url: string
  };
  priceInfo: {
    amount: {
      value: number | string;
      denom: string;
    };
    changedRate: number;
  };
}
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
export interface ChartInfo {
  xAxisLabels: string[];
  yAxisLabels: string[];
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
    },
    changedRate: 7.43,
  },
};

function createXAxisDatas(currentTab: TokenChartGraphPeriodType, chartData: IPrices1d[], numberAxis: number) {
  const now = Date.now();
  const uniqueDates = [...new Set(chartData.map(entry => entry.date.split(" ")[0]))];
  const uniqueMonths = [...new Set(chartData.map(item => new Date(item.date).toLocaleString("default", { month: "long" })))];
  const uniqueYears = [...new Set(chartData.map(item => new Date(item.date).getFullYear()))];

  switch (currentTab) {
    case "1D":
      return getXaxis1Day(chartData, numberAxis);
    case "7D":
      return Array.from({ length: Math.min(numberAxis, uniqueDates.length) }, (_, index) => {
        const date = new Date(now);
        date.setDate(date.getDate() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
    case "1M":
      return getXaxis1M(chartData, Math.min(numberAxis, uniqueDates.length));
    case "1Y":
      return Array.from({ length: Math.min(uniqueMonths.length, numberAxis) }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
    case "ALL":
    default:
      return Array.from({ length: Math.min(uniqueYears.length, numberAxis) }, (_, index) => {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
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
  price91d: ""
};

const TokenChartContainer: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>(dummyTokenInfo);
  const [currentTab, setCurrentTab] = useState<TokenChartGraphPeriodType>("1D");
  const router = useRouter();
  const [fromSelectToken, setFromSelectToken] = useAtom(TokenState.fromSelectToken);
  const clearModal = useClearModal();
  const { breakpoint } = useWindowSize();


  const { openModal: openTradingModal } = useTokenTradingModal({
    onClickConfirm: (value: any) => {
      console.log(value);
      
      setFromSelectToken(false);
      clearModal();
    }
  });
  const { data: { tokens = [] } = {} } = useGetTokensList();
  const { data: { 
    prices1d = [], 
    prices7d = [],
    prices1m = [],
    prices1y = [],
    pricesBefore = priceChangeDetailInit,
    currentPrice = ""
  } = {}, isLoading} = useGetTokenDetailByPath(router.query["tokenB"] as string, { enabled: !!router.query["tokenB"]});
  const [componentRef, size] = useComponentSize(isLoading);

  useEffect(() => {
    const currentToken: TokenModel = tokens.filter((item: TokenModel) => item.symbol === router.query["token-path"])[0];
    if (currentToken) {

      const priceToday = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.priceToday));
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
          },
          changedRate: Number(priceToday || 0),
        },
      }));
      if (!fromSelectToken && !currentToken.logoURI) {
        openTradingModal({ symbol: currentToken.symbol, path: currentToken.path });
      }
    }
  }, [router.query, pricesBefore.toString(), currentPrice, tokens]);
  
  const changeTab = useCallback((tab: string) => {
    const currentTab = TokenChartGraphPeriods.find(period => `${period}` === tab) || "1D";
    setCurrentTab(currentTab);
  }, []);

  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor((((size.width || 0) + 20) - 25) / (currentTab === TokenChartGraphPeriods[0] ? 60: 100));
    return Math.floor((((size.width || 0) + 20) - 8) / 80);
  }, [size.width, breakpoint, currentTab]);
  
  const chartData = useMemo(() => {
    if (currentTab === TokenChartGraphPeriods[0]) {
      return prices1d;
    }
    if (currentTab === TokenChartGraphPeriods[1]) {
      return prices7d;
    }
    if (currentTab === TokenChartGraphPeriods[2]) {
      return prices1m;
    }
    if (currentTab === TokenChartGraphPeriods[3]) {
      return prices1y;
    }
    return prices1y;
  }, [prices1d.toString(), prices7d.toString, prices1m.toString(), prices1y.toString(), currentTab]);

  const getChartInfo = useCallback(() => {
    const xAxisLabels = createXAxisDatas(currentTab, chartData, countXAxis);
    
    const length = currentTab === TokenChartGraphPeriods[0] ? 144 : currentTab === TokenChartGraphPeriods[1] ? 168 :
    currentTab === TokenChartGraphPeriods[2] ? 180 : currentTab === TokenChartGraphPeriods[3] ? 365 : 144;
 

    const datas = chartData?.length > 0 ? chartData.slice(0, length).map((item: IPriceResponse, i: number) => {
      return {
        amount: {
          value: i === 0 ? "0" : `${item.price}`,
          denom: "",
        },
        time: item.date,
      };
    }) : [];
    const yAxisLabels = getYAxisLabels(datas.map((item) => Number(item.amount.value).toFixed(2)));


    const chartInfo: ChartInfo = {
      xAxisLabels,
      yAxisLabels,
      datas: datas,
    };

    return chartInfo;
  }, [currentTab, chartData.toString(), countXAxis]);
  
  const getYAxisLabels = (datas: string[]): string[] => {
    const temp = [datas[0]];
    const space = (Number(datas[datas.length - 1]) - Number(datas[0])) / 6;
    for(let i = 0; i < 5; i++) {
      temp.push(`${(Number(temp[0]) + space * (i+1)).toFixed(2)}`);
    }
    temp.push(datas[datas.length-1]);
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
