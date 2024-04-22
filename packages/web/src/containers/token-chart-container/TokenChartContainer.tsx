import React, { useCallback, useState, useEffect, useMemo } from "react";
import TokenChart from "@components/token/token-chart/TokenChart";
import { useRouter } from "next/router";
import { IPriceResponse, IPrices1d } from "@repositories/token";
import { useAtom } from "jotai";
import { TokenState } from "@states/index";
import { useTokenTradingModal } from "@hooks/swap/use-token-trading-modal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useComponentSize from "@hooks/common/use-component-size";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import { checkPositivePrice, generateDateSequence } from "@utils/common";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGetTokenByPath, useGetTokenDetailByPath } from "@query/token";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { formatUsdNumber3Digits } from "@utils/number-utils";
import { useLoading } from "@hooks/common/use-loading";
import dayjs from "dayjs";
import {
  getLabelChartV2,
  getLocalizeTime,
  getNumberOfAxis,
} from "@utils/chart";

export const TokenChartGraphPeriods = ["1D", "7D", "1M", "1Y", "ALL"] as const;
export type TokenChartGraphPeriodType = (typeof TokenChartGraphPeriods)[number];

const DEFAULT_PADDING = 12;
const DEFAULT_X_LABEL_WIDTH = 82;
const DEFAULT_X_LABEL_WIDTH_MOBILE = 70;

const getXaxis1Day = (data: Date[]): string[] => {
  const currentLocale = dayjs.locale();
  const rs: string[] = [];
  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  for (const entry of data) {
    const data = new Date(entry).toLocaleTimeString(
      currentLocale,
      formatOptions,
    );
    rs.push(data);
  }
  return rs;
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
    name: "",
    symbol: "",
    image: "",
    pkg_path: "",
    decimals: 1,
    description: "",
    website_url: "",
  },
  priceInfo: {
    amount: {
      value: "",
      denom: "",
      status: MATH_NEGATIVE_TYPE.NONE,
    },
    changedRate: 0,
  },
};

function createXAxisDatas(
  currentTab: TokenChartGraphPeriodType,
  chartData: IPrices1d[],
  numberAxis: number,
  date: Date[],
  space: number,
) {
  const setData = chartData.slice(space).map(entry => entry.date.split(" ")[0]);
  const labelX = getLabelChartV2(
    setData,
    Math.round((setData.length - space) / (numberAxis - 1)),
  );

  switch (currentTab) {
    case "1D":
      return getXaxis1Day(date);
    case "7D":
      return labelX;
    case "1M":
      return labelX;
    case "1Y":
      return labelX;
    case "ALL":
    default:
      return labelX;
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
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();
  const { isLoadingCommon } = useLoading();

  const { openModal: openTradingModal } = useTokenTradingModal({
    onClickConfirm: () => {
      setFromSelectToken(false);
      clearModal();
    },
  });
  const path = router.query["token-path"] as string;
  const { data: tokenB } = useGetTokenByPath(path, {
    enabled: !!path,
    refetchInterval: 1000 * 10,
  });
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
  } = useGetTokenDetailByPath(path === "gnot" ? wugnotPath : path, {
    enabled: !!path,
    refetchInterval: 1000 * 10,
  });
  const [componentRef, size] = useComponentSize(isLoading || isLoadingCommon);
  useEffect(() => {
    if (tokenB) {
      const dataToday = checkPositivePrice(
        pricesBefore.latestPrice,
        pricesBefore.priceToday,
        19,
      );
      setTokenInfo(() => ({
        token: {
          name: getGnotPath(tokenB).name,
          symbol: getGnotPath(tokenB).symbol,
          image: getGnotPath(tokenB).logoURI,
          pkg_path: getGnotPath(tokenB).path,
          decimals: 1,
          description: tokenB.description || "",
          website_url: tokenB.websiteURL || "",
        },
        priceInfo: {
          amount: {
            value: currentPrice
              ? Number(formatUsdNumber3Digits(currentPrice))
              : "",
            denom: "USD",
            status: dataToday.status,
          },
          changedRate: Math.abs(Number(dataToday.value || 0)),
        },
      }));
      if (!fromSelectToken && !tokenB.logoURI) {
        openTradingModal({
          symbol: tokenB.symbol,
          path: tokenB.path,
        });
      }
    }
  }, [router.query, pricesBefore.toString(), currentPrice, tokenB, gnot]);

  const changeTab = useCallback((tab: string) => {
    const currentTab =
      TokenChartGraphPeriods.find(period => `${period}` === tab) || "1D";
    setCurrentTab(currentTab);
  }, []);

  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor(
        ((size.width || 0) + 20 - 25) /
          (currentTab === TokenChartGraphPeriods[0] ? 80 : 100),
      );
    return Math.floor(
      ((size.width || 0) + 20 - 8) /
        (currentTab === TokenChartGraphPeriods[0] ? 70 : 90),
    );
  }, [size.width, breakpoint, currentTab]);

  const chartData = useMemo(() => {
    let temp = prices1y || [];
    if (currentTab === TokenChartGraphPeriods[0]) {
      temp = prices1d || [];
    }
    if (currentTab === TokenChartGraphPeriods[1]) {
      temp = prices7d || [];
    }
    if (currentTab === TokenChartGraphPeriods[2]) {
      temp = prices1m || [];
    }
    if (currentTab === TokenChartGraphPeriods[3]) {
      temp = prices1y || [];
    }
    return temp.map(item => ({
      ...item,
      date: item.date,
    }));
  }, [prices1d, prices7d, prices1m, prices1y, currentTab]);

  const getChartInfo = useCallback(() => {
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
    const currentLength = chartData.length;
    const startTime = Math.max(0, currentLength - length - 1);

    const temp = generateDateSequence(
      getLocalizeTime(chartData?.[startTime]?.date),
      getLocalizeTime(chartData[currentLength - 1]?.date),
      countXAxis > 2 ? Math.floor(24 / Math.min(countXAxis, 7)) : 3,
    );

    const labelWidth =
      breakpoint === DEVICE_TYPE.MOBILE
        ? DEFAULT_X_LABEL_WIDTH_MOBILE
        : DEFAULT_X_LABEL_WIDTH;
    const spaceBetweenLeftYAxisWithFirstLabel = Math.round(
      (labelWidth / 2 + DEFAULT_PADDING) / (size.width / chartData.length),
    );
    const numberOfAxis = getNumberOfAxis(
      chartData.length - DEFAULT_PADDING * 2 - labelWidth,
      countXAxis,
      3,
    );
    const xAxisLabels = createXAxisDatas(
      currentTab,
      chartData,
      numberOfAxis,
      temp,
      spaceBetweenLeftYAxisWithFirstLabel,
    );
    const datas =
      chartData?.length > 0
        ? [
            ...chartData
              .slice(startTime, chartData.length - 1)
              .map((item: IPriceResponse) => {
                return {
                  amount: {
                    value: `${item.price}`,
                    denom: "",
                  },
                  time: getLocalizeTime(item.date),
                };
              }),
            {
              amount: {
                value: `${currentPrice}`,
                denom: "",
              },
              time: getLocalizeTime(chartData[chartData.length - 1].date),
            },
          ]
        : [];
    const yAxisLabels = getYAxisLabels(
      datas.map(item => Number(item.amount.value).toFixed(2)),
    );
    const chartInfo: ChartInfo = {
      xAxisLabels,
      yAxisLabels,
      datas: datas,
    };
    return chartInfo;
  }, [currentTab, chartData, countXAxis, breakpoint]);

  const getYAxisLabels = (datas: string[]): string[] => {
    const convertNumber = datas.map(item => Number(item));
    const minPoint = Math.min(...convertNumber);
    const maxPoint = Math.max(...convertNumber);
    const temp = [minPoint.toString()];
    const space = Number(Number((maxPoint - minPoint) / 5));
    for (
      let i = Number(minPoint) + Number(space);
      i < Number(maxPoint);
      i += space
    ) {
      temp.push(`${Number(i).toFixed(2)}`);
    }
    temp.push(maxPoint.toString());
    const uniqueLabel = [...new Set(temp)];
    if (uniqueLabel.length === 1) uniqueLabel.unshift("0");
    return uniqueLabel;
  };
  return (
    <TokenChart
      tokenInfo={tokenInfo}
      chartInfo={getChartInfo()}
      currentTab={currentTab}
      changeTab={changeTab}
      loading={isLoading || isLoadingCommon}
      componentRef={componentRef}
      size={size}
      breakpoint={breakpoint}
    />
  );
};

export default TokenChartContainer;
