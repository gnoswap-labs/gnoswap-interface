import React, { useCallback, useState, useEffect } from "react";
import TokenChart from "@components/token/token-chart/TokenChart";

export const TokenChartGraphPeriods = ["1D", "7D", "1M", "1Y", "ALL"] as const;
export type TokenChartGraphPeriodType = typeof TokenChartGraphPeriods[number];

export interface TokenInfo {
  token: {
    name: string;
    symbol: string;
    image: string;
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
  const length = 60;
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
  const [tokenInfo] = useState<TokenInfo>(dummyTokenInfo);
  const [currentTab, setCurrentTab] = useState<TokenChartGraphPeriodType>("1D");
  const [loading, setLoading] = useState(true);
  
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
    return ["1", "2", "3", "4", "5", "6", "7"];
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
