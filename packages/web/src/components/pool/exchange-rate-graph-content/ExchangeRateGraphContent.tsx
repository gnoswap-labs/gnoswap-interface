import ChartScopeSelectTab from "@components/common/chart-scope-select-tab/ChartScopeSelectTab";
import LineGraph from "@components/common/line-graph/LineGraph";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import { useWindowSize } from "@hooks/common/use-window-size";
import { TokenModel } from "@models/token/token-model";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";
import { DEVICE_TYPE } from "@styles/media";
import { getLocalizeTime, parseDate } from "@utils/chart";
import { useMemo, useState } from "react";
import PairRatio from "../../common/pair-ratio/PairRatio";
import { ExchangeRateGraphContentHeader, ExchangeRateGraphContentWrapper, ExchangeRateGraphXAxisWrapper } from "./ExchangeRateGraphContent.styles";

interface ExchangeRateGraphContentProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  feeTier: string;
  onSwap?: (swap: boolean) => void
  data?: TokenExchangeRateGraphResponse
}

const calculateMiddleIndices = (totalLabels = 0, countXAxis = 0) => {
  const indices = new Set<number>();
  // Helper function to add indices
  const addIndices = (start: number, end: number) => {
    const mid = Math.floor((start + end) / 2);
    if (!indices.has(mid)) {
      indices.add(mid);
      if (indices.size < countXAxis) {
        // Add midpoint of the left subarray
        addIndices(start, mid - 1);
        // Add midpoint of the right subarray
        addIndices(mid + 1, end);
      }
    }
  };

  // Always include the first and last labels
  indices.add(0);
  indices.add(totalLabels - 1);

  // Begin by adding the middle of the entire array
  addIndices(0, totalLabels - 1);

  // Convert to array and sort to ensure the correct order
  return Array.from(indices).sort((a, b) => b - a);
};

function ExchangeRateGraphContent({
  tokenA,
  tokenB,
  onSwap,
  data,
}: ExchangeRateGraphContentProps) {
  const [selectedScope, setSelectedScope] = useState<CHART_DAY_SCOPE_TYPE>(CHART_DAY_SCOPE_TYPE["7D"]);
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();
  const { breakpoint } = useWindowSize();

  const dataMemo = useMemo(() => {
    const getCurrentData = () => {
      switch (selectedScope) {
        case "30D":
          return data?.last1m;
        case "ALL":
          return data?.all;
        case "7D":
        default:
          return data?.last7d;
      }
    };

    return getCurrentData()?.map(item => ({
      time: item.time,
      value: item.value.toString()
    })).sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    }).reduce(
      (pre: any, next: any) => {
        return [
          ...pre,
          {
            value: next.value || 0,
            time: getLocalizeTime(next.time),
          },
        ];
      },
      [],
    );
  }, [data, selectedScope]);

  const xAxisLabels = useMemo(() => {
    const getCurrentData = () => {
      switch (selectedScope) {
        case "30D":
          return data?.last1m;
        case "ALL":
          return data?.all;
        case "7D":
        default:
          return data?.last7d;
      }
    };

    return getCurrentData()?.map(item => ({
      time: item.time,
      value: item.value.toString()
    })).sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    }).reduce(
      (pre: any, next: any) => {
        const time = parseDate(next.time);
        return [...pre, time];
      },
      [],
    );
  }, [data, selectedScope]);

  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor(((size.width || 0) + 20 - 25) / 100);
    return Math.floor(((size.width || 0) + 20 - 8) / 80);
  }, [size.width, breakpoint]);

  const labelIndicesToShow = useMemo(() => {
    return calculateMiddleIndices(xAxisLabels?.length, Math.min(countXAxis, 4));
  }, [countXAxis, xAxisLabels?.length]);

  return (<ExchangeRateGraphContentWrapper>
    <ExchangeRateGraphContentHeader>
      <PairRatio
        onSwap={onSwap}
        tokenA={tokenA}
        tokenB={tokenB}
        feeTier={""}
      />
      <ChartScopeSelectTab
        size={"SMALL"}
        list={Object.values(CHART_DAY_SCOPE_TYPE)}
        selected={selectedScope}
        onChange={(value) => setSelectedScope(value)}
      />
    </ExchangeRateGraphContentHeader>
    <div className="data-wrapper">
      <div className="graph-wrap" ref={componentRef}>
        <LineGraph
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
          renderBottom={(baseLineNumberWidth) => {
            console.log("🚀 ~ baseLineNumberWidth:", baseLineNumberWidth);
            return <ExchangeRateGraphXAxisWrapper innerWidth={(baseLineNumberWidth !== 0) ? `calc(100% - ${baseLineNumberWidth}px)` : "100%"}>
              <div className="exchange-rate-graph-xaxis">
                {labelIndicesToShow.map((x, i) => (
                  <span key={i}>{xAxisLabels?.[x]}</span>
                ))}
              </div>
            </ExchangeRateGraphXAxisWrapper>;
          }}
        />
      </div>
    </div>
  </ExchangeRateGraphContentWrapper>);
}

export default ExchangeRateGraphContent;

