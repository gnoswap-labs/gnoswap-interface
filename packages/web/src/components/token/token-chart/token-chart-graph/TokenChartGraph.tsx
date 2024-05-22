import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import React, { useMemo } from "react";
import { TokenChartGraphWrapper, YAxisLabelWrapper } from "./TokenChartGraph.styles";
import { DEVICE_TYPE } from "@styles/media";
import { TokenChartGraphPeriodType } from "@containers/token-chart-container/TokenChartContainer";
import { ComponentSize } from "@hooks/common/use-component-size";

export interface TokenChartGraphProps {
  datas: {
    amount: {
      value: string;
      denom: string;
    };
    time: string;
  }[];
  xAxisLabels: string[];
  yAxisLabels: string[];
  currentTab: TokenChartGraphPeriodType;
  componentRef: React.RefObject<HTMLDivElement>;
  size: ComponentSize;
  breakpoint: DEVICE_TYPE;
}

const TokenChartGraph: React.FC<TokenChartGraphProps> = ({
  datas,
  xAxisLabels,
  yAxisLabels,
  componentRef,
  size,
  breakpoint,
}) => {
  const theme = useTheme();
  const customData = useMemo(() => {
    const temp = 47.55;
    return {
      height: temp,
      locationTooltip: 198,
    };
  }, []);

  const typeYAxis = useMemo(() => {
    if (yAxisLabels.length > 0) {
      const leng = Math.max(...yAxisLabels.map(x => x.length), 0);
      if (leng > 0) {
        if (leng <= 3) return "large-text";
        if (leng === 4) return "medium-text";
        return "small-text";
      }
    }
    return "small-text";
  }, [yAxisLabels]);

  const longestYAxisValue = useMemo(() => {
    return yAxisLabels.reduce((current, next) => {
      if (next.length > current.length) {
        return next;
      }

      return current;
    });
  }, [yAxisLabels]);

  return (
    <TokenChartGraphWrapper>
      <div className="data-wrapper" ref={componentRef}>
        <LineGraph
          cursor
          className="graph"
          width={size?.width || 0}
          height={(size?.height || 0) - (breakpoint !== DEVICE_TYPE.MOBILE ? 40 : 30) - customData.height}
          color="#192EA2"
          strokeWidth={1}
          datas={datas.map(data => ({
            value: data.amount.value,
            time: data.time,
          }))}
          showBaseLine
          baseLineMap={[true, false, false, true]}
          firstPointColor={theme.color.border05}
          customData={customData}
        />
        <div className={`xaxis-wrapper ${xAxisLabels.length === 1 ? "xaxis-wrapper-center" : ""}`}>
          {xAxisLabels.map((label, index) => (
            <span key={index} className="label">
              {label}
            </span>
          ))}
        </div>
      </div>
      <YAxisLabelWrapper width={Number(longestYAxisValue.length) / 8 * 58}>
        {yAxisLabels.map((label, index) => (
          <span key={index} className={`label ${typeYAxis}`}>
            ${label}
          </span>
        ))}
      </YAxisLabelWrapper>
    </TokenChartGraphWrapper>
  );
};

export default TokenChartGraph;
