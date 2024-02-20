import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import React, { useMemo } from "react";
import { TokenChartGraphWrapper } from "./TokenChartGraph.styles";
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
  right: number;
  left: number;
}

const TokenChartGraph: React.FC<TokenChartGraphProps> = ({
  datas,
  xAxisLabels,
  yAxisLabels,
  componentRef,
  size,
  breakpoint,
  left,
  right,
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
      const leng = yAxisLabels[0].length;
      if (leng > 0) {
        if (leng <=3 ) return "large-text";
        if (leng === 4) return "medium-text";
        return "small-text";
      }
    }
    return "small-text";
  }, [yAxisLabels]);

  const paddingLeft = useMemo(() => {
    return Math.max(0, Math.floor(size?.width / datas.length * left - 27));
  }, [size, datas.length, left]);
  const paddingRight = useMemo(() => {
    return Math.max(0, Math.floor(size?.width / datas.length * right - 27));
  }, [size, datas.length, right]);
  
  return (
    <TokenChartGraphWrapper left={breakpoint !== DEVICE_TYPE.MOBILE ?  paddingLeft : Math.max(paddingLeft, 12)} right={paddingRight}>
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
      <div className="yaxis-wrapper">
        {yAxisLabels.map((label, index) => (
          <span key={index} className={`label ${typeYAxis}`}>
            ${label}
          </span>
        ))}
      </div>
    </TokenChartGraphWrapper>
  );
};

export default TokenChartGraph;
