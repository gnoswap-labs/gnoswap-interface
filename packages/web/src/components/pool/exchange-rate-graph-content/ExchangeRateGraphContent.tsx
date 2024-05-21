import LineGraph from "@components/common/line-graph/LineGraph";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import { useWindowSize } from "@hooks/common/use-window-size";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { DEVICE_TYPE } from "@styles/media";
import { getLocalizeTime, parseDate } from "@utils/chart";
import { useMemo } from "react";
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
  onMouseMove?: ((data?: LineGraphData) => void);
  onMouseOut?: ((active: boolean) => void);
}

export function ExchangeRateGraphContent({
  poolData,
  selectedScope,
  isReversed,
  onMouseMove,
  onMouseOut,
}: ExchangeRateGraphContentProps) {
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();
  const { breakpoint } = useWindowSize();

  const dataMemo = useMemo(() => {
    const data = poolData.priceRatio;

    const getCurrentData = () => {
      switch (selectedScope) {
        case "30D":
          return data?.["30d"];
        case "ALL":
          return data?.all;
        case "7D":
        default:
          return data?.["7d"];
      }
    };

    return getCurrentData()
      ?.map(item => ({
        time: item.date,
        value: item.ratio,
      }))
      .sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      })
      .reduce((pre: any, next: any) => {
        const value = (() => {
          if (!next.value || next.value === 0) return 0;

          if (isReversed) return (1 / Number(next.value)).toString();

          return next.value;
        })();

        return [
          ...pre,
          {
            value: value,
            time: getLocalizeTime(next.time),
          },
        ];
      }, []);
  }, [isReversed, poolData.priceRatio, selectedScope]);

  const xAxisLabels = useMemo(() => {
    const data = poolData.priceRatio;

    const getCurrentData = () => {
      switch (selectedScope) {
        case "30D":
          return data?.["30d"];
        case "ALL":
          return data?.["all"];
        case "7D":
        default:
          return data?.["7d"];
      }
    };

    return getCurrentData()
      ?.map(item => ({
        time: item.date,
        value: item.ratio.toString(),
      }))
      .sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      })
      .reduce((pre: any, next: any) => {
        const time = parseDate(next.time);
        return [...pre, time];
      }, []);
  }, [poolData.priceRatio, selectedScope]);

  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor(((size.width || 0) + 20 - 25) / 100);
    return Math.floor(((size.width || 0) + 20 - 8) / 80);
  }, [size.width, breakpoint]);

  const labelIndicesToShow = useMemo(() => {
    const spacing = ((xAxisLabels?.length ?? 0) - 1) / (countXAxis - 1);
    return Array.from({ length: countXAxis }, (_, index) =>
      Math.floor(spacing * index),
    ).reverse();
  }, [countXAxis, xAxisLabels?.length]);

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
            renderBottom={baseLineNumberWidth => {
              return (
                <ExchangeRateGraphXAxisWrapper
                  innerWidth={
                    baseLineNumberWidth !== 0
                      ? `calc(100% - ${baseLineNumberWidth}px)`
                      : "100%"
                  }
                >
                  <div className="exchange-rate-graph-xaxis">
                    {labelIndicesToShow?.map((x, i) => (
                      <span key={i}>{xAxisLabels?.[x]}</span>
                    ))}
                  </div>
                </ExchangeRateGraphXAxisWrapper>
              );
            }}
            onMouseOut={onMouseOut}
          />
        </div>
      </div>
    </ExchangeRateGraphContentWrapper>
  );
}

export default ExchangeRateGraphContent;
