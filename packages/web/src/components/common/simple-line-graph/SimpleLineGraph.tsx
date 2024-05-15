import { useTheme } from "@emotion/react";
import React, { useCallback } from "react";
import LineGraph from "../line-graph/LineGraph";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

export interface SimpleLineGraphProps {
  datas: number[];
  width?: number;
  height?: number;
  status: MATH_NEGATIVE_TYPE
}

const SimpleLineGraph: React.FC<SimpleLineGraphProps> = ({
  datas,
  width,
  height,
  status,
}) => {
  const theme = useTheme();

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
    if (status === MATH_NEGATIVE_TYPE.NONE) {
      if (datas[0] < datas[datas.length - 1]) {
        return "UP";
      } else return "DOWN";
    }

    if (status === MATH_NEGATIVE_TYPE.POSITIVE) {
      return "UP";
    }
    return "DOWN";
  }, [datas]);

  const getColor = useCallback(() => {
    if (getStatus() === "UP") {
      return theme.color.greenOpacity;
    }
    return theme.color.redOpacity;
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
    />
  );
};

export default SimpleLineGraph;