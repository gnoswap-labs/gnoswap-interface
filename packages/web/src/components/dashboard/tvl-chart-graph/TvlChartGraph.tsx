import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import React, { useCallback, useMemo } from "react";
import { TokenChartGraphXLabel, TvlChartGraphWrapper } from "./TvlChartGraph.styles";
import dayjs from "dayjs";
import { CHART_TYPE } from "@constants/option.constant";
import { toPriceFormat } from "@utils/number-utils";
import BigNumber from "bignumber.js";
export interface TvlChartGraphProps {
  datas: {
    amount: {
      value: string;
      denom: string;
    };
    time: string;
  }[];
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
}) => {
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();

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

    const offsetValue = formatInfo.offset * DATE_MINUTE_VALUE;

    if (startX + offsetValue > minPositionX) {
      startXWithOffset = startX + offsetValue;
    } else {
      startXWithOffset = startX + offsetValue + timeDiff;
    }
    // }

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



  const mappedData = useMemo(() => {
    return datas.map(data => ({
      value: data.amount.value,
      time: data.time,
    }));
  }, [datas]);

  const displayXAxisLabels: XAxisLabel[] = useMemo(() => {
    const formatInfo = makeTimePeriodFormatInfo();
    const minimumXAxis = formatInfo.textLength / 2; // text size and padding


    const result = xAxisLabels.filter(
      label =>
        label.position > minimumXAxis &&
        label.position < size.width - minimumXAxis,
    );
    if (result.length === 1) {
      return [{
        position: size.width / 2,
        value: new Date(datas[0].time).getTime(),
        text: dayjs(datas[0].time).format(formatInfo.format),
      }];
    }

    return result;
  }, [datas, size.width, xAxisLabels]);

  const hasOnlyOneLabel = useMemo(() => displayXAxisLabels.length === 1, [displayXAxisLabels.length]);

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
            popupYValueFormatter={(value) => toPriceFormat(
              BigNumber(value).toFixed(), {
              isRounding: false,
              usd: true,
              greaterThan1Decimals: 1,
              forcedGreaterThan1Decimals: false,
              lestThan1Decimals: 1,
              isKMBFormat: false,
            })}
          />
        </div>
        <div className={`xaxis-wrapper ${hasOnlyOneLabel ? "center" : ""}`}>
          {displayXAxisLabels.map((value, index) => (
            <TokenChartGraphXLabel x={value.position} key={index}>{value?.text}</TokenChartGraphXLabel>
          ))}
        </div>
      </div>
    </TvlChartGraphWrapper>
  );
};

export default TvlChartGraph;
