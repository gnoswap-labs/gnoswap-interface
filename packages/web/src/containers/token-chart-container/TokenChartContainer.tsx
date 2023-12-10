import React, { useCallback, useState, useEffect } from "react";
import TokenChart from "@components/token/token-chart/TokenChart";
import { useRouter } from "next/router";
import { useGetTokenDetailByPath, useGetTokensList } from "src/react-query/token";
import { IPriceResponse } from "@repositories/token";
import { TokenModel } from "@models/token/token-model";

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

const priceChangeDetailInit = {
  priceToday: "0",
  changeToday: "0",
  price1h: "0",
  change1h: "0",
  price1d: "0",
  change1d: "0",
  price7d: "0",
  change7d: "0",
  price30d: "0",
  change30d: "0",
  price60d: "0",
  change60d: "0",
  price90d: "0",
  change90d: "0",
};

const TokenChartContainer: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>(dummyTokenInfo);
  const [currentTab, setCurrentTab] = useState<TokenChartGraphPeriodType>("1D");
  const router = useRouter();

  const { data: { tokens = [] } = {} } = useGetTokensList();
  const { data: { prices = [], priceChangeDetail = priceChangeDetailInit, currentPrice = "" } = {}, isLoading} = useGetTokenDetailByPath(router.query["tokenB"] as string, { enabled: !!router.query["tokenB"]});


  useEffect(() => {
    const currentToken: TokenModel = tokens.filter((item: TokenModel) => item.symbol === router.query["token-path"])[0];
    if (currentToken) {
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
          changedRate: Number(priceChangeDetail?.changeToday || 0),
        },
      }));
    }
  }, [router.query, priceChangeDetail.toString(), currentPrice, tokens]);
  
  const changeTab = useCallback((tab: string) => {
    const currentTab = TokenChartGraphPeriods.find(period => `${period}` === tab) || "1D";
    setCurrentTab(currentTab);
  }, []);

  const getChartInfo = useCallback(() => {
    const xAxisLabels = getXAxisLabels(currentTab);
    const yAxisLabels = getYAxisLabels();
    
    const length = currentTab === TokenChartGraphPeriods[0] ? 144 : currentTab === TokenChartGraphPeriods[1] ? 168 :
    currentTab === TokenChartGraphPeriods[2] ? 180 : currentTab === TokenChartGraphPeriods[3] ? 365 : 144;
 

    const datas = prices?.length > 0 ? prices.slice(0, length).map((item: IPriceResponse, i: number) => {
      return {
        amount: {
          value: i === 0 ? "0" : `${item.price}`,
          denom: "",
        },
        time: item.date,
      };
    }) : [];


    const chartInfo: ChartInfo = {
      xAxisLabels,
      yAxisLabels,
      datas: datas,
    };

    return chartInfo;
  }, [currentTab, prices.toString()]);

  const getXAxisLabels = (currentTab: TokenChartGraphPeriodType): string[] => {
    return createXAxisDummyDatas(currentTab);
  };

  const getYAxisLabels = (): string[] => {
    const fake1 = ["10", "20", "30", "40", "50", "60", "70"];
    const fake2 = ["100", "200", "300", "400", "500", "600", "700"];
    const fake3 = ["1000", "2000", "3000", "4000", "5000", "6000", "7000"];
    return [fake1, fake2, fake3][Math.floor(Math.random() * 3)];
  };

  return (
    <TokenChart
      tokenInfo={tokenInfo}
      chartInfo={getChartInfo()}
      currentTab={currentTab}
      changeTab={changeTab}
      loading={isLoading}
    />
  );
};

export default TokenChartContainer;
