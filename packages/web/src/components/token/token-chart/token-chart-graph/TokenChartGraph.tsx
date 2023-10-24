import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import React, { useRef, useState, useEffect } from "react";
import { TokenChartGraphWrapper } from "./TokenChartGraph.styles";

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
}

const TokenChartGraph: React.FC<TokenChartGraphProps> = ({
  datas,
  xAxisLabels,
  yAxisLabels,
}) => {
  const theme = useTheme();
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

  return (
    <TokenChartGraphWrapper>
      <div className="data-wrapper" ref={wrapperRef}>
        <LineGraph
          cursor
          className="graph"
          width={width}
          height={height}
          color={theme.color.point}
          strokeWidth={1}
          datas={datas.map(data => ({
            value: data.amount.value,
            time: data.time,
          }))}
          firstPointColor={theme.color.border05}
        />
        <div className="xaxis-wrapper">
          {xAxisLabels.map((label, index) => (
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
