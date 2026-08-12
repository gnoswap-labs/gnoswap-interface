import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import LineGraph from "@components/common/line-graph/LineGraph";
import { LANGUAGE_CODE_MAP } from "@constants/common.constant";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import { getLocalizeTime, parseDate } from "@utils/chart";
import { getYAxisInfo } from "@utils/chart-y-axis";

import { ExchangeRateGraphContentWrapper, ExchangeRateGraphXAxisWrapper } from "./ExchangeRateGraphContent.styles";
import { IPoolPriceRatioItem } from "@models/pool/pool-model";

interface LineGraphData {
  value: string;
  time: string;
}

interface ExchangeRateGraphContentProps {
  pricesData: IPoolPriceRatioItem[];
  onMouseMove?: (data?: LineGraphData) => void;
  onMouseOut?: (active: boolean) => void;
}

export function ExchangeRateGraphContent({ pricesData, onMouseMove, onMouseOut }: ExchangeRateGraphContentProps) {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();
  const { breakpoint } = useWindowSize();

  const pricesChartData = useMemo(() => {
    if (!pricesData) return [];
    return [...pricesData].reverse().map(item => {
      return {
        value: item.ratio,
        time: getLocalizeTime(item.date),
      };
    });
  }, [pricesData]);

  const xAxisLabels = useMemo(() => {
    return pricesChartData?.map(item => parseDate(item.time, LANGUAGE_CODE_MAP[i18n.language]));
  }, [pricesChartData, i18n.language]);

  const hasSingleData = useMemo(() => pricesChartData?.length === 1, [pricesChartData]);

  const chartYAxis = useMemo(() => {
    const latestPrice = pricesChartData[pricesChartData.length - 1]?.value;
    const tokenPrice = latestPrice !== undefined ? Number(latestPrice) : undefined;

    return getYAxisInfo(
      pricesChartData.map(item => item.value),
      tokenPrice !== undefined && Number.isFinite(tokenPrice) ? tokenPrice : undefined,
    );
  }, [pricesChartData]);

  const countXAxis = useMemo(() => {
    if (hasSingleData) return 1;

    if (breakpoint !== DEVICE_TYPE.MOBILE) return Math.floor(((size.width || 0) + 20 - 25) / 100);
    return Math.floor(((size.width || 0) + 20 - 8) / 80);
  }, [hasSingleData, breakpoint, size.width]);

  const labelIndicesToShow = useMemo(() => {
    if (hasSingleData) return [0];

    const spacing = ((xAxisLabels?.length ?? 0) - 1) / (countXAxis - 1);

    return Array.from({ length: countXAxis }, (_, index) => Math.floor(spacing * index));
  }, [countXAxis, hasSingleData, xAxisLabels]);

  const renderXAxis = useCallback(
    (baseLineNumberWidth: number) => {
      return (
        <ExchangeRateGraphXAxisWrapper
          innerWidth={baseLineNumberWidth !== 0 ? `calc(100% - ${baseLineNumberWidth}px)` : "100%"}
        >
          <div className={`exchange-rate-graph-xaxis ${hasSingleData ? "single-point" : ""}`}>
            {labelIndicesToShow?.map((x, i) => (
              <span key={i}>{xAxisLabels?.[x]}</span>
            ))}
          </div>
        </ExchangeRateGraphXAxisWrapper>
      );
    },
    [hasSingleData, labelIndicesToShow, xAxisLabels],
  );

  return (
    <ExchangeRateGraphContentWrapper>
      <div className="data-wrapper">
        <div className="graph-wrap" ref={componentRef}>
          <LineGraph
            onMouseMove={onMouseMove}
            cursor
            className="graph"
            width={size.width}
            height={size.height - 36}
            color={theme.color.background04Hover}
            strokeWidth={1}
            datas={pricesChartData ?? []}
            typeOfChart="exchange-rate"
            customData={{
              height: 36,
              locationTooltip: 170,
            }}
            showBaseLine
            showBaseLineLabels
            baseLineLabels={chartYAxis.labels}
            yAxisMin={chartYAxis.minValue}
            yAxisMax={chartYAxis.maxValue}
            renderSinglePointAsLine
            isShowTooltip={true}
            renderBottom={renderXAxis}
            onMouseOut={onMouseOut}
          />
        </div>
      </div>
    </ExchangeRateGraphContentWrapper>
  );
}

export default ExchangeRateGraphContent;
