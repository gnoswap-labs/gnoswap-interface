import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import TokenChart from "@components/token/token-chart/TokenChart";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useComponentSize from "@hooks/common/use-component-size";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenWarningModal } from "@hooks/token/use-token-warning-modal";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import {
  useGetToken,
  useGetTokenDetails,
  useGetTokenPrices,
} from "@query/token";
import { IPriceResponse, IPrices1d } from "@repositories/token";
import { TokenState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import {
  getLabelChartV2,
  getLocalizeTime,
  getNumberOfAxis,
} from "@utils/chart";
import { checkPositivePrice, generateDateSequence } from "@utils/common";
import { formatPrice } from "@utils/new-number-utils";

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
    changedRate: string;
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
    changedRate: "0",
  },
};

function createXAxisDatas(
  currentTab: TokenChartGraphPeriodType,
  chartData: IPrices1d[],
  numberAxis: number,
  date: Date[],
  space: number,
) {
  const setData = chartData.slice(space).map(entry => entry.time.split(" ")[0]);
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
  const router = useCustomRouter();
  const [fromSelectToken, setFromSelectToken] = useAtom(
    TokenState.fromSelectToken,
  );
  const clearModal = useClearModal();
  const { breakpoint } = useWindowSize();
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();

  const { openModal: openWarningModal } = useTokenWarningModal({
    onClickConfirm: () => {
      setFromSelectToken(false);
      clearModal();
    },
    onClickClose: () => {
      router.push("/");
    },
  });
  const path = router.getTokenPath();
  const { data: tokenB } = useGetToken(path, {
    enabled: !!path,
  });
  const {
    data: { prices1d = [], prices7d = [], prices1m = [], prices1y = [] } = {},
    isLoading,
  } = useGetTokenDetails(path === "gnot" ? wugnotPath : path, {
    enabled: !!path,
  });

  const {
    data: { usd: currentPrice, pricesBefore = priceChangeDetailInit } = {},
  } = useGetTokenPrices(path === "gnot" ? wugnotPath : path, {
    enabled: !!path,
  });

  const [componentRef, size] = useComponentSize(
    isLoading || isLoadingCommon || path,
  );

  useEffect(() => {
    if (tokenB) {
      const dataToday = checkPositivePrice(
        pricesBefore.latestPrice,
        pricesBefore.priceToday,
        {
          displayStatusSign: false,
        },
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
            value: formatPrice(currentPrice),
            denom: "USD",
            status: dataToday.status,
          },
          changedRate: dataToday.percentDisplay,
        },
      }));
      if (!fromSelectToken && !tokenB.logoURI) {
        openWarningModal(tokenB);
      }
    }
  }, [
    router.query,
    pricesBefore.latestPrice,
    currentPrice,
    tokenB,
    gnot,
    pricesBefore.priceToday,
    fromSelectToken,
  ]);

  const changeTab = useCallback((tab: string) => {
    const currentTab =
      TokenChartGraphPeriods.find(period => `${period}` === tab) || "1D";
    setCurrentTab(currentTab);
  }, []);

  const countXAxis = useMemo(() => {
    if (breakpoint === DEVICE_TYPE.MOBILE)
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
      date: item.time,
    }));
  }, [prices1d, prices7d, prices1m, prices1y, currentTab]);

  const getChartInfo = useCallback(() => {
    // You will ask me why the code is like this. old data it needs like that
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
      getLocalizeTime(chartData?.[startTime]?.time),
      getLocalizeTime(chartData[currentLength - 1]?.time),
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

    const datas = [
      {
        amount: {
          value: (pricesBefore.latestPrice || 0).toString(),
          denom: "",
        },
        time: getLocalizeTime(new Date()),
      },
      ...chartData.map((item: IPriceResponse) => ({
        amount: {
          value: `${item.price}`,
          denom: "",
        },
        time: getLocalizeTime(item.time),
      })),
    ].reverse();

    const yAxisLabels = getYAxisLabels(
      datas.map(item => BigNumber(item.amount.value).toFormat(6)),
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
    const minValue = BigNumber(Math.min(...convertNumber));
    const maxValue = BigNumber(Math.max(...convertNumber));

    const originalGap = maxValue.minus(minValue);

    const minPoint = minValue.minus(originalGap.multipliedBy(0.05));
    const maxPoint = maxValue.plus(originalGap.multipliedBy(0.05));

    if (datas.every(item => item === datas[0])) {
      return [
        formatPrice(minValue.multipliedBy(0.95), {
          usd: false,
        }),
        formatPrice(minValue, {
          usd: false,
        }),
        formatPrice(minValue.multipliedBy(1.05), {
          usd: false,
        }),
      ];
    }

    const gap = maxPoint.minus(minPoint);
    const space = gap.dividedBy(5);
    const temp = [
      formatPrice(minPoint, {
        usd: false,
      }),
    ];
    for (
      let i = minPoint.plus(space);
      i.isLessThan(maxPoint);
      i = i.plus(space)
    ) {
      temp.push(
        `${formatPrice(i, {
          usd: false,
        })}`,
      );
    }
    temp.push(
      formatPrice(maxPoint, {
        usd: false,
      }),
    );

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
