import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import LineGraph from "@components/common/line-graph/LineGraph";
import { LANGUAGE_CODE_MAP } from "@constants/common.constant";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import { useWindowSize } from "@hooks/common/use-window-size";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { DEVICE_TYPE } from "@styles/media";
import { getLocalizeTime, parseDate } from "@utils/chart";

import {
  ExchangeRateGraphContentWrapper,
  ExchangeRateGraphXAxisWrapper,
} from "./ExchangeRateGraphContent.styles";

interface LineGraphData {
  value: string;
  time: string;
}

interface ExchangeRateGraphContentProps {
  poolData: PoolDetailModel;
  selectedScope: CHART_DAY_SCOPE_TYPE;
  isReversed: boolean;
  onMouseMove?: (data?: LineGraphData) => void;
  onMouseOut?: (active: boolean) => void;
}

export function ExchangeRateGraphContent({
  poolData,
  selectedScope,
  isReversed,
  onMouseMove,
  onMouseOut,
}: ExchangeRateGraphContentProps) {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();
  const { breakpoint } = useWindowSize();

  const sortedRawDataByType = useMemo(() => {
    const data = poolData.priceRatio;
    let result = [];

    switch (selectedScope) {
      case "30D":
        result = data?.["30d"];
        break;
      case "ALL":
        result = data?.all;
        break;
      case "7D":
      default:
        result = data?.["7d"];
        break;
    }

    return (result ?? [])?.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [poolData.priceRatio, selectedScope]);

  const dataMemo = useMemo(() => {
    const lastTime =
      sortedRawDataByType.length >= 1
        ? new Date(sortedRawDataByType[sortedRawDataByType.length - 1]?.date)
        : undefined;
    const last2Time =
      sortedRawDataByType.length >= 2
        ? new Date(sortedRawDataByType[sortedRawDataByType.length - 2]?.date)
        : undefined;
    const latestTimeGap = (() => {
      if (lastTime && last2Time)
        return lastTime.getTime() - last2Time.getTime();
    })();

    const fakeLastTime = (() => {
      if (lastTime && latestTimeGap)
        return new Date(lastTime.getTime() + latestTimeGap);

      return new Date();
    })();

    const dataByType = [
      ...sortedRawDataByType,
      {
        date: fakeLastTime.toString(),
        ratio: poolData.price,
      },
    ];

    return dataByType?.map((item, index) => {
      const value = (() => {
        if (!item.ratio || item.ratio === "0") return "0";

        if (index === dataByType.length - 1) return item.ratio.toString();

        return isReversed
          ? (1 / Number(item.ratio)).toString()
          : item.ratio.toString();
      })();

      return {
        value: value,
        time: getLocalizeTime(item.date),
      };
    });
  }, [isReversed, poolData.price, sortedRawDataByType]);

  const xAxisLabels = useMemo(() => {
    return sortedRawDataByType?.map(item =>
      parseDate(item.date, LANGUAGE_CODE_MAP[i18n.language]),
    );
  }, [sortedRawDataByType, i18n.language]);

  const hasSingleData = useMemo(() => dataMemo?.length === 1, [dataMemo]);

  const countXAxis = useMemo(() => {
    if (hasSingleData) return 1;

    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor(((size.width || 0) + 20 - 25) / 100);
    return Math.floor(((size.width || 0) + 20 - 8) / 80);
  }, [hasSingleData, breakpoint, size.width]);

  const labelIndicesToShow = useMemo(() => {
    if (hasSingleData) return [0];

    const spacing = ((xAxisLabels?.length ?? 0) - 1) / (countXAxis - 1);

    return Array.from({ length: countXAxis }, (_, index) =>
      Math.floor(spacing * index),
    );
  }, [countXAxis, hasSingleData, xAxisLabels]);

  const renderXAxis = useCallback(
    (baseLineNumberWidth: number) => {
      return (
        <ExchangeRateGraphXAxisWrapper
          innerWidth={
            baseLineNumberWidth !== 0
              ? `calc(100% - ${baseLineNumberWidth}px)`
              : "100%"
          }
        >
          <div
            className={`exchange-rate-graph-xaxis ${
              hasSingleData ? "single-point" : ""
            }`}
          >
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
            datas={dataMemo ?? []}
            typeOfChart="exchange-rate"
            customData={{
              height: 36,
              locationTooltip: 170,
            }}
            showBaseLine
            showBaseLineLabels
            isShowTooltip={false}
            renderBottom={renderXAxis}
            onMouseOut={onMouseOut}
          />
        </div>
      </div>
    </ExchangeRateGraphContentWrapper>
  );
}

export default ExchangeRateGraphContent;
