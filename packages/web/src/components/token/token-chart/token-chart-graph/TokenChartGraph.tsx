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
        setHeight(newHeight - 30);
      }
    };
    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);
  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor((((width || 0) + 20) - 25) / (currentTab === TokenChartGraphPeriods[0] ? 60: 100));
    return Math.floor((((width || 0) + 20) - 8) / 80);
    }, [width, breakpoint, currentTab]);
  const customWidth = useMemo(() => {
    return breakpoint !== DEVICE_TYPE.MOBILE ? 47.55: 32.35;
  }, [breakpoint]);

  return (
    <TokenChartGraphWrapper>
      <div className="data-wrapper" ref={wrapperRef}>
        <LineGraph
          cursor
          className="graph"
          width={width}
          height={(height || 0) - customWidth}
          color={"#192EA2"}
          strokeWidth={1}
          datas={datas.map(data => ({
            value: data.amount.value,
            time: data.time,
          }))}
          firstPointColor={theme.color.border05}
          customWidth={customWidth}
        />
        <div className="xaxis-wrapper">
          {xAxisLabels.slice(0, Math.min(countXAxis, 8)).map((label, index) => (
            <span key={index} className="label">
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="yaxis-wrapper">
        {yAxisLabels.map((label, index) => (
          <span key={index} className="label">
            {label}
          </span>
        ))}
      </div>
    </TokenChartGraphWrapper>
  );
};

export default TokenChartGraph;
