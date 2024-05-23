import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import React, { useCallback, useMemo } from "react";
import {
  TokenChartGraphWrapper,
  TokenChartGraphXLabel,
} from "./TokenChartGraph.styles";
import { DEVICE_TYPE } from "@styles/media";
import { TokenChartGraphPeriodType } from "@containers/token-chart-container/TokenChartContainer";
import { ComponentSize } from "@hooks/common/use-component-size";
import dayjs from "dayjs";

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

interface XAxisLabel {
  position: number;
  value: number;
  text: string;
}

const DATE_MINUTE_VALUE = 60 * 1_000;
const DATE_HOUR_VALUE = 60 * DATE_MINUTE_VALUE;

const FORMAT_HOUR = "h:ss A";
const FORMAT_DATE = "MMM D, YYYY";
const FORMAT_HOUR_LENGTH = 70;
const FORMAT_DATE_LENGTH = 95;

function makeTimePeriodFormatInfo(period: TokenChartGraphPeriodType) {
  const offset = new Date().getTimezoneOffset();
  switch (period) {
    case "1D":
      return {
        minimumSpacing: DATE_HOUR_VALUE,
        format: FORMAT_HOUR,
        textLength: FORMAT_HOUR_LENGTH,
        offset,
      };
    default:
      return {
        minimumSpacing: DATE_HOUR_VALUE * 24,
        format: FORMAT_DATE,
        textLength: FORMAT_DATE_LENGTH,
        offset,
      };
  }
}

const TokenChartGraph: React.FC<TokenChartGraphProps> = ({
  datas,
  yAxisLabels,
  componentRef,
  size,
  breakpoint,
  currentTab,
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

  const xAxisRange = useMemo(() => {
    const times = datas.map(d => new Date(d.time).getTime());
    const minX = Math.min(...times);
    const maxX = Math.max(...times);

    return {
      minX,
      maxX,
    };
  }, [datas]);

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
    const formatInfo = makeTimePeriodFormatInfo(currentTab);

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
  }, [xAxisRange, currentTab, size.width, scaleX]);

  // Filter the list of X-axis labels to display
  const displayXAxisLabels: XAxisLabel[] = useMemo(() => {
    const formatInfo = makeTimePeriodFormatInfo(currentTab);
    const minimumXAxis = formatInfo.textLength / 2; // text size and padding

    return xAxisLabels.filter(
      label =>
        label.position > minimumXAxis &&
        label.position < size.width - minimumXAxis,
    );
  }, [currentTab, size.width, xAxisLabels]);

  return (
    <TokenChartGraphWrapper>
      <div className="data-wrapper" ref={componentRef}>
        <LineGraph
          cursor
          className="graph"
          width={size?.width || 0}
          height={
            (size?.height || 0) -
            (breakpoint !== DEVICE_TYPE.MOBILE ? 40 : 30) -
            customData.height
          }
          color="#192EA2"
          strokeWidth={1}
          datas={datas.map(data => ({
            value: data.amount.value,
            time: data.time,
          }))}
          firstPointColor={theme.color.border05}
          customData={customData}
        />
        <div
          className={`xaxis-wrapper ${
            xAxisLabels.length === 1 ? "xaxis-wrapper-center" : ""
          }`}
        >
          {displayXAxisLabels.map((value, index) => (
            <TokenChartGraphXLabel key={index} x={value.position}>
              {value.text}
            </TokenChartGraphXLabel>
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
