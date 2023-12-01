import React, { useCallback, useState, useEffect } from "react";
import TokenChart from "@components/token/token-chart/TokenChart";
import TOKEN_LIST from "@repositories/token/mock/assets.json";
import { useRouter } from "next/router";

export const TokenChartGraphPeriods = ["1D", "7D", "1M", "1Y", "ALL"] as const;
export type TokenChartGraphPeriodType = typeof TokenChartGraphPeriods[number];

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
      value: number;
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

function createXAxisDummyDatas(currentTab: TokenChartGraphPeriodType) {
  const now = Date.now();
  switch (currentTab) {
    case "1D":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setHours(date.getHours() - 3 * index);
        const hour = date.getHours().toString().padStart(2, "0");
        return `${hour}:00`;
      }).reverse();
    case "7D":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setDate(date.getDate() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
    case "1M":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
    
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
    case "1Y":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
    
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
    case "ALL":
    default:
      return Array.from({ length: 10 }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
    
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
  }
}

function createDummyAmountDatas() {
  const length = 55;
  return Array.from({ length }, (_, index) => {
    const date = new Date();
    date.setHours(date.getHours() - index);

    return {
      amount: {
        value: `${Math.round(Math.random() * 500) + 1000}`,
        denom: "USD"
      },
      time: date.toString()
    };
  }).reverse();
}

const TokenChartContainer: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>(dummyTokenInfo);
  const [currentTab, setCurrentTab] = useState<TokenChartGraphPeriodType>("1D");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const currentToken = TOKEN_LIST.filter(item => item.symbol === router.query["token-path"])[0];
    setTokenInfo(prev => ({
      ...prev,
      token: {
        ...currentToken
      }
    }));
  }, [router.query]);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const changeTab = useCallback((tab: string) => {
    const currentTab = TokenChartGraphPeriods.find(period => `${period}` === tab) || "1D";
    setCurrentTab(currentTab);
  }, []);

  const getChartInfo = useCallback(() => {
    const xAxisLabels = getXAxisLabels(currentTab);
    const yAxisLabels = getYAxisLabels();

    const datas = createDummyAmountDatas();

    const chartInfo: ChartInfo = {
      xAxisLabels,
      yAxisLabels,
      datas: datas,
    };

    return chartInfo;
  }, [currentTab]);

  const getXAxisLabels = (currentTab: TokenChartGraphPeriodType): string[] => {
    return createXAxisDummyDatas(currentTab);
  };

  const getYAxisLabels = (): string[] => {
    const fake1 = ["1", "2", "3", "4", "5", "6", "7"];
    const fake2 = ["10", "20", "30", "40", "50", "60", "70"];
    const fake3 = ["100", "200", "300", "400", "500", "600", "700"];
    return [fake1, fake2, fake3][Math.floor(Math.random() * 3)];
  };
  
  return (
    <TokenChart
      tokenInfo={tokenInfo}
      chartInfo={getChartInfo()}
      currentTab={currentTab}
      changeTab={changeTab}
      loading={loading}
    />
  );
};

export default TokenChartContainer;
