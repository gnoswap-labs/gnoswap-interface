import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { TokenChartGraphWrapper } from "./TokenChartGraph.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import { TokenChartGraphPeriodType, TokenChartGraphPeriods } from "@containers/token-chart-container/TokenChartContainer";

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
}

const TokenChartGraph: React.FC<TokenChartGraphProps> = ({
  datas,
  xAxisLabels,
  yAxisLabels,
  currentTab,
}) => {
  const theme = useTheme();
  const { breakpoint } = useWindowSize();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        const newWidth = wrapperRef.current.getBoundingClientRect().width;
        const newHeight = wrapperRef.current.getBoundingClientRect().height;
        
        setWidth(newWidth);
        setHeight(newHeight - (breakpoint !== DEVICE_TYPE.MOBILE ? 40 : 30));
      }
    };
    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [breakpoint]);
  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor((((width || 0) + 20) - 25) / (currentTab === TokenChartGraphPeriods[0] ? 60: 100));
    return Math.floor((((width || 0) + 20) - 8) / 80);
    }, [width, breakpoint, currentTab]);
  const customData = useMemo(() => {
    const temp = 47.55;
    return {
      height: temp,
      marginTop: temp / 2,
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

  return (
    <TokenChartGraphWrapper>
      <div className="data-wrapper" ref={wrapperRef}>
        <LineGraph
          cursor
          className="graph"
          width={width}
          height={(height || 0) - customData.height}
          color={"#192EA2"}
          strokeWidth={1}
          datas={datas.map(data => ({
            value: data.amount.value,
            time: data.time,
          }))}
          firstPointColor={theme.color.border05}
          customData={customData}
        />
        <div className="xaxis-wrapper">
          {xAxisLabels.slice(0, Math.min(countXAxis, 7)).map((label, index) => (
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
