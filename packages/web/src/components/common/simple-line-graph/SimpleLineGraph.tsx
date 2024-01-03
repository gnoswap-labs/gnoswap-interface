import { useTheme } from "@emotion/react";
import React, { useCallback, useMemo } from "react";
import LineGraph from "../line-graph/LineGraph";

export interface SimpleLineGraphProps {
  datas: number[];
  width?: number;
  height?: number;
}

const SimpleLineGraph: React.FC<SimpleLineGraphProps> = ({
  datas,
  width,
  height
}) => {
  const theme = useTheme();

  const checkSameData = useMemo(() => {
    return datas.length > 0 && datas.every(element => element === datas[0]);
  }, [datas]);

  const getChartDatas = useCallback(() => {
    return datas.map((data, index) => ({
      time: `${index + 1000}`,
      value: `${data}`
    }));
  }, [datas]);

  const getStatus = useCallback((): "UP" | "DOWN" => {
    if (datas.length < 2) {
      return "UP";
    }

    const result = datas.reduce((sum, current) => sum + current, 0);
    const average = result / datas.length;

    if (datas[datas.length - 1] > average) {
      return "UP";
    }
    return "DOWN";
  }, [datas]);

  const getColor = useCallback(() => {
    if (getStatus() === "UP") {
      return theme.color.green01;
    }
    return theme.color.red01;
  }, [getStatus, theme]);

  const getGradientColor = useCallback(() => {
    if (getStatus() === "UP") {
      return {
        start: "#16C78A66",
        end: "#16C78A00"
      };
    }
    return {
      start: "#EA394366",
      end: "#EA394300"
    };
  }, [getStatus]);

  return (
    <LineGraph
      smooth
      strokeWidth={1}
      datas={getChartDatas()}
      color={getColor()}
      gradientStartColor={getGradientColor().start}
      gradientEndColor={getGradientColor().end}
      width={width}
      height={height}
      centerLineColor={checkSameData ? theme.color.green01 : undefined}
    />
  );
};

export default SimpleLineGraph;