import React, { useCallback, useState } from "react";
import TokenChart from "@components/token/token-chart/TokenChart";

export const TokenChartGraphPeriods = ["1D", "7D", "1M", "1Y", "YTD"] as const;
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
    image: "https://miro.medium.com/v2/resize:fill:44:44/1*61CWWk33Fx8vLVvto5nJHQ.png",
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
        const monthStr = `${date.getMonth() + 1}`.padStart(2, "0");
        const dateStr = `${date.getDate()}`.padStart(2, "0");
        return `${monthStr}-${dateStr}`;
      }).reverse();
    case "1M":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const yearStr = date.getFullYear();
        const monthStr = `${date.getMonth() + 1}`.padStart(2, "0");
        return `${yearStr}-${monthStr}`;
      }).reverse();
    case "1Y":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - 1 * index);
        const yearStr = date.getFullYear();
        return `${yearStr}`;
      }).reverse();
    case "YTD":
    default:
      return Array.from({ length: 10 }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const yearStr = date.getFullYear();
        const monthStr = `${date.getMonth() + 1}`.padStart(2, "0");
        return `${yearStr}-${monthStr}`;
      }).reverse();
  }
}

function createDummyAmountDatas() {
  const length = 24;
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
    />
  );
};

export default TokenChartContainer;
