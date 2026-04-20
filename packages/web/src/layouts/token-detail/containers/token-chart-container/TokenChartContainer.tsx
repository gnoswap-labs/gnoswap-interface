import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { RefetchInterval } from "@common/values";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useComponentSize from "@hooks/common/use-component-size";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenWarningModal } from "@hooks/token/ui/use-token-warning-modal";
import { useGetToken, useGetTokenDetails, useGetTokenPrices } from "@query/token";
import { IPriceResponse, IPrices1d } from "@repositories/token";
import { TokenState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import { getLabelChartV2, getLocalizeTime, getNumberOfAxis } from "@utils/chart";
import { checkPositivePrice, generateDateSequence } from "@utils/common";
import { formatPrice } from "@utils/new-number-utils";

import TokenChart, { ChartInfo, TokenInfo } from "../../components/token-chart/TokenChart";

const TokenChartGraphPeriods: Readonly<string[]> = ["1D", "7D", "1M", "1Y", "All"] as const;
export type TokenChartGraphPeriodType = typeof TokenChartGraphPeriods[number];

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
    const data = new Date(entry).toLocaleTimeString(currentLocale, formatOptions);
    rs.push(data);
  }
  return rs;
};

export const dummyTokenInfo: TokenInfo = {
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
    priceGradeType: "NONE",
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
  const labelX = getLabelChartV2(setData, Math.round((setData.length - space) / (numberAxis - 1)));

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

// Allowed y-axis scale units — `{1..9} * 10^n` (e.g., 0.01, 0.02, 1, 10, 20, 300, 700000).
const SINGLE_DIGIT_SCALE_BASES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Find the smallest allowed scale unit that satisfies `candidate >= threshold` (or
 * `candidate > threshold` when `inclusive` is false).
 */
function findAllowedScaleUnit(threshold: BigNumber, inclusive = true): BigNumber {
  const thresholdNumber = threshold.toNumber();
  if (!isFinite(thresholdNumber) || thresholdNumber <= 0) {
    return new BigNumber(1);
  }

  const startExponent = Math.floor(Math.log10(thresholdNumber)) - 1;
  for (let e = startExponent; e <= startExponent + 4; e++) {
    const magnitude = new BigNumber(10).pow(e);
    for (const base of SINGLE_DIGIT_SCALE_BASES) {
      const candidate = magnitude.multipliedBy(base);
      const satisfied = inclusive ? candidate.isGreaterThanOrEqualTo(threshold) : candidate.isGreaterThan(threshold);
      if (satisfied) return candidate;
    }
  }

  return new BigNumber(1);
}

function roundToMultiple(value: BigNumber, unit: BigNumber, mode: "ceil" | "floor"): BigNumber {
  if (unit.isZero()) return value;
  const roundingMode = mode === "ceil" ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR;
  return value.dividedBy(unit).integerValue(roundingMode).multipliedBy(unit);
}

function trimTrailingZeros(value: string): string {
  return value
    .replace(/(\.\d*?[1-9])0+$/g, "$1")
    .replace(/\.0+$/g, "")
    .replace(/\.$/g, "");
}

function truncateToSignificantDigits(value: BigNumber, significantDigits: number): string {
  if (!value.isFinite() || value.isZero()) return "0";

  const negative = value.isNegative();
  const absValue = value.abs();
  const exponent = absValue.e ?? 0;
  const decimalPlaces = Math.max(significantDigits - exponent - 1, 0);
  const factor = new BigNumber(10).pow(decimalPlaces);
  const truncated = absValue.multipliedBy(factor).integerValue(BigNumber.ROUND_FLOOR).dividedBy(factor);
  const normalized = trimTrailingZeros(truncated.toFixed(decimalPlaces));

  return negative ? `-${normalized}` : normalized;
}

function getYAxisInfo(
  datas: string[],
  tokenPrice?: number,
): { labels: string[]; minValue: string; maxValue: string } {
  const Y_AXIS_LABEL_COUNT = 6;
  const Y_AXIS_STEP_COUNT = Y_AXIS_LABEL_COUNT - 1;
  // Fall back to fixed-decimal formatting until the price query resolves to avoid
  // a visible flicker where high-priced tokens briefly render with significant
  // digits before switching.
  const useSignificantFormat = tokenPrice !== undefined && tokenPrice < 1;

  // Derive the number of decimals from the step unit so narrow ranges on tokens
  // priced >= $1 still get distinct labels (e.g., step 0.001 -> 3 decimals).
  const formatYAxisValue = (value: BigNumber, scaleUnit?: BigNumber) => {
    if (useSignificantFormat) {
      return truncateToSignificantDigits(value, 3);
    }
    const unitDecimals = scaleUnit ? Math.max(0, -(scaleUnit.e ?? 0)) : 0;
    const decimals = Math.max(2, unitDecimals);
    return value.toFixed(decimals);
  };

  const numericDatas = datas.map(item => new BigNumber(item)).filter(item => !item.isNaN());

  if (numericDatas.length === 0) {
    return {
      labels: new Array(Y_AXIS_LABEL_COUNT).fill(formatYAxisValue(new BigNumber(0))),
      minValue: "0",
      maxValue: "0",
    };
  }

  const lowest = BigNumber.min(...numericDatas);
  const highest = BigNumber.max(...numericDatas);

  if (highest.isZero() && lowest.isZero()) {
    return {
      labels: new Array(Y_AXIS_LABEL_COUNT).fill(formatYAxisValue(new BigNumber(0))),
      minValue: "0",
      maxValue: "0",
    };
  }

  const targetMax = highest.multipliedBy(1.2);
  const targetMin = lowest.multipliedBy(0.8);
  const targetRange = targetMax.minus(targetMin);

  // Pick the smallest allowed scale unit so the window [minPoint..maxPoint] covers
  let scaleUnit = findAllowedScaleUnit(targetRange.dividedBy(Y_AXIS_STEP_COUNT));

  let maxPoint = roundToMultiple(targetMax, scaleUnit, "ceil");
  let minPoint = roundToMultiple(targetMin, scaleUnit, "floor");
  let actualSteps = maxPoint.minus(minPoint).dividedBy(scaleUnit).integerValue(BigNumber.ROUND_HALF_UP).toNumber();

  for (let attempt = 0; attempt < 16 && actualSteps > Y_AXIS_STEP_COUNT; attempt++) {
    scaleUnit = findAllowedScaleUnit(scaleUnit, false);
    maxPoint = roundToMultiple(targetMax, scaleUnit, "ceil");
    minPoint = roundToMultiple(targetMin, scaleUnit, "floor");
    actualSteps = maxPoint.minus(minPoint).dividedBy(scaleUnit).integerValue(BigNumber.ROUND_HALF_UP).toNumber();
  }

  // If the snapped window fits in fewer than 5 steps, expand so we always render
  while (
    maxPoint.minus(minPoint).dividedBy(scaleUnit).integerValue(BigNumber.ROUND_HALF_UP).toNumber() < Y_AXIS_STEP_COUNT
  ) {
    const topSlack = maxPoint.minus(targetMax).abs();
    const bottomSlack = targetMin.minus(minPoint).abs();

    if (topSlack.isLessThanOrEqualTo(bottomSlack)) {
      maxPoint = maxPoint.plus(scaleUnit);
    } else {
      const candidateMin = minPoint.minus(scaleUnit);
      if (lowest.isGreaterThanOrEqualTo(0) && candidateMin.isLessThan(0)) {
        maxPoint = maxPoint.plus(scaleUnit);
      } else {
        minPoint = candidateMin;
      }
    }
  }

  const labels: string[] = [];
  for (let i = 0; i <= Y_AXIS_STEP_COUNT; i++) {
    const value = minPoint.plus(scaleUnit.multipliedBy(i));
    labels.push(formatYAxisValue(value, scaleUnit));
  }

  return {
    labels,
    minValue: minPoint.toFixed(),
    maxValue: maxPoint.toFixed(),
  };
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
  const [fromSelectToken, setFromSelectToken] = useAtom(TokenState.fromSelectToken);
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
  const { data: { prices1d = [], prices7d = [], prices1m = [], prices1y = [] } = {}, isLoading } = useGetTokenDetails(
    path === "ugnot" ? wugnotPath : path,
    {
      enabled: !!path,
    },
  );

  const { data: { priceGradeType, usd: currentPrice, pricesBefore = priceChangeDetailInit } = {} } = useGetTokenPrices(
    path === "ugnot" ? wugnotPath : path,
    {
      enabled: !!path,
      refetchInterval: RefetchInterval.Frequent,
    },
  );

  const [componentRef, size] = useComponentSize(isLoading || isLoadingCommon || path);

  useEffect(() => {
    if (tokenB) {
      const dataToday = checkPositivePrice(pricesBefore.latestPrice, pricesBefore.price1d, {
        displayStatusSign: false,
      });
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
            value: formatPrice(currentPrice, { forcedDecimals: true }),
            denom: "USD",
            status: dataToday.status,
          },
          priceGradeType: priceGradeType || "NONE",
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
    priceGradeType,
  ]);

  const changeTab = useCallback((tab: string) => {
    const currentTab = TokenChartGraphPeriods.find(period => `${period}` === tab) || "1D";
    setCurrentTab(currentTab);
  }, []);

  const countXAxis = useMemo(() => {
    if (breakpoint === DEVICE_TYPE.MOBILE)
      return Math.floor(((size.width || 0) + 20 - 25) / (currentTab === TokenChartGraphPeriods[0] ? 80 : 100));

    return Math.floor(((size.width || 0) + 20 - 8) / (currentTab === TokenChartGraphPeriods[0] ? 70 : 90));
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

  const chartInfo = useMemo<ChartInfo>(() => {
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

    const labelWidth = breakpoint === DEVICE_TYPE.MOBILE ? DEFAULT_X_LABEL_WIDTH_MOBILE : DEFAULT_X_LABEL_WIDTH;
    const spaceBetweenLeftYAxisWithFirstLabel = Math.round(
      (labelWidth / 2 + DEFAULT_PADDING) / (size.width / chartData.length),
    );
    const numberOfAxis = getNumberOfAxis(chartData.length - DEFAULT_PADDING * 2 - labelWidth, countXAxis, 3);
    const xAxisLabels = createXAxisDatas(
      currentTab,
      chartData,
      numberOfAxis,
      temp,
      spaceBetweenLeftYAxisWithFirstLabel,
    );

    const datas = chartData
      .map((item: IPriceResponse) => ({
        amount: {
          value: `${item.price}`,
          denom: "",
        },
        time: getLocalizeTime(item.time),
      }))
      .reverse();

    const { labels: yAxisLabels, minValue: yAxisMin, maxValue: yAxisMax } = getYAxisInfo(
      datas.map(item => item.amount.value),
      currentPrice !== undefined ? Number(currentPrice) : undefined,
    );
    return {
      xAxisLabels,
      yAxisLabels,
      yAxisMin,
      yAxisMax,
      datas: datas,
    };
  }, [currentTab, chartData, countXAxis, breakpoint, currentPrice, size.width]);

  return (
    <TokenChart
      tokenInfo={tokenInfo}
      chartInfo={chartInfo}
      tabs={TokenChartGraphPeriods}
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
