import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import React, { useCallback, useMemo } from "react";
import { TvlChartGraphWrapper } from "./TvlChartGraph.styles";
// import { useWindowSize } from "@hooks/common/use-window-size";
// import { DEVICE_TYPE } from "@styles/media";
import dayjs from "dayjs";
import { CHART_TYPE } from "@constants/option.constant";
export interface TvlChartGraphProps {
  datas: {
    amount: {
      value: string;
      denom: string;
    };
    time: string;
  }[];
  xAxisLabels: string[];
  tvlChartType: CHART_TYPE;
  yAxisLabels?: string[];
}

interface XAxisLabel {
  position: number;
  value: number;
  text: string;
}

const DATE_MINUTE_VALUE = 60 * 1_000;
const DATE_HOUR_VALUE = 60 * DATE_MINUTE_VALUE;

const FORMAT_DATE = "MMM D, YYYY";
const FORMAT_DATE_LENGTH = 95;

// const calculateMiddleIndices = (totalLabels = 0, countXAxis = 0) => {
//   const indices = new Set<number>();
//   // Helper function to add indices
//   const addIndices = (start: number, end: number) => {
//     const mid = Math.floor((start + end) / 2);
//     if (!indices.has(mid)) {
//       indices.add(mid);
//       if (indices.size < countXAxis) {
//         // Add midpoint of the left subarray
//         addIndices(start, mid - 1);
//         // Add midpoint of the right subarray
//         addIndices(mid + 1, end);
//       }
//     }
//   };

//   // Always include the first and last labels
//   indices.add(0);
//   indices.add(totalLabels - 1);

//   // Begin by adding the middle of the entire array
//   addIndices(0, totalLabels - 1);

//   // Convert to array and sort to ensure the correct order
//   return Array.from(indices).sort((a, b) => b - a);
// };


function makeTimePeriodFormatInfo() {
  const offset = new Date().getTimezoneOffset();
  return {
    minimumSpacing: DATE_HOUR_VALUE * 24,
    format: FORMAT_DATE,
    textLength: FORMAT_DATE_LENGTH,
    offset,
  };
}

const TvlChartGraph: React.FC<TvlChartGraphProps> = ({
  datas,
  // xAxisLabels,
}) => {
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();
  // const { breakpoint } = useWindowSize();

  const xAxisRange = useMemo(() => {
    const times = datas.map(d => new Date(d.time).getTime());
    const minX = Math.min(...times);
    const maxX = Math.max(...times);

    return {
      minX,
      maxX,
    };
  }, [datas]);

  const hasOnlyOnePoint = useMemo(() => (xAxisRange.maxX - xAxisRange.minX === 0), [xAxisRange.maxX, xAxisRange.minX]);

  const scaleX = useCallback(
    (value: number) => {
      const range = xAxisRange.maxX - xAxisRange.minX;
      return ((value - xAxisRange.minX) * size.width) / range;
    },
    [size.width, xAxisRange.maxX, xAxisRange.minX],
  );

  const revertX = useCallback(
    (value: number) => {
      const range = xAxisRange.maxX - xAxisRange.minX;
      return (value * range) / size.width + xAxisRange.minX;
    },
    [size.width, xAxisRange.maxX, xAxisRange.minX],
  );

  /**
   * The x-axis label data.
   * Generate labels with a minimum reference time per axis.
   */
  const xAxisLabels: XAxisLabel[] = useMemo(() => {
    const { minX, maxX } = xAxisRange;
    const formatInfo = makeTimePeriodFormatInfo();

    // Find the maximum number of labels and time intervals for each graph container size.
    const maxLabelCount = Math.floor((size.width - 24) / formatInfo.textLength);
    const spacingCount = Math.ceil(
      Math.ceil((maxX - minX) / formatInfo.minimumSpacing) / maxLabelCount,
    );

    // Get the time data for the first label and generate a list of labels.
    const timeDiff = formatInfo.minimumSpacing * spacingCount;

    const minPositionX = revertX(24 + formatInfo.textLength / 2);
    const startX = minPositionX - (minPositionX % formatInfo.minimumSpacing);

    let startXWithOffset = startX;

    if (formatInfo.minimumSpacing >= DATE_HOUR_VALUE * 24) {
      const offsetValue = formatInfo.offset * DATE_MINUTE_VALUE;

      if (startX + offsetValue > minPositionX) {
        startXWithOffset = startX + offsetValue;
      } else {
        startXWithOffset = startX + offsetValue + timeDiff;
      }
    }

    const length = Math.ceil((maxX - minX) / timeDiff);

    return Array.from({ length }, (_, index) => {
      const datetime = startXWithOffset + index * timeDiff;
      return {
        position: scaleX(datetime),
        value: datetime,
        text: dayjs(datetime).format(formatInfo.format),
      };
    });
  }, [xAxisRange, size.width, scaleX, revertX]);
  console.log("🚀 ~ constxAxisLabels:XAxisLabel[]=useMemo ~ xAxisLabels:", xAxisLabels);


  const mappedData = useMemo(() => {
    return datas.map(data => ({
      value: data.amount.value,
      time: data.time,
    }));
  }, [datas]);

  const displayXAxisLabels: XAxisLabel[] = useMemo(() => {
    const formatInfo = makeTimePeriodFormatInfo();
    const minimumXAxis = formatInfo.textLength / 2; // text size and padding

    if (hasOnlyOnePoint) {
      return [{
        position: size.width / 2,
        value: new Date(datas[0].time).getTime(),
        text: dayjs(datas[0].time).format(formatInfo.format),
      }];
    }

    return xAxisLabels.filter(
      label =>
        label.position > minimumXAxis &&
        label.position < size.width - minimumXAxis,
    );
  }, [datas, hasOnlyOnePoint, size.width, xAxisLabels]);

  // const countXAxis = useMemo(() => {
  //   if (breakpoint !== DEVICE_TYPE.MOBILE)
  //     return Math.floor(((size.width || 0) + 20 - 25) / 100);
  //   return Math.floor(((size.width || 0) + 20 - 8) / 80);
  // }, [size.width, breakpoint]);

  // const labelIndicesToShow = useMemo(() => {
  //   return calculateMiddleIndices(xAxisLabels.length, Math.min(countXAxis, 4));
  // }, [countXAxis, xAxisLabels.length]);

  return (
    <TvlChartGraphWrapper>
      <div className="data-wrapper">
        <div className="graph-wrap" ref={componentRef}>
          <LineGraph
            cursor
            className="graph"
            width={size.width}
            height={size.height - 36}
            color={theme.color.background04Hover}
            strokeWidth={1}
            datas={mappedData}
            typeOfChart="tvl"
            customData={{
              height: 36,
              locationTooltip: 170,
            }}
          />
        </div>
        <div className={`xaxis-wrapper ${hasOnlyOnePoint ? "center" : ""}`}>
          {displayXAxisLabels.map((value, index) => (
            <span key={index}>{value?.text}</span>
          ))}
          {/* {xAxisLabels.slice(0, Math.min(countXAxis, 8)).map((label, index) => (
            <span key={index}>{label}</span>
          ))} */}
        </div>
      </div>
    </TvlChartGraphWrapper>
  );
};

export default TvlChartGraph;
