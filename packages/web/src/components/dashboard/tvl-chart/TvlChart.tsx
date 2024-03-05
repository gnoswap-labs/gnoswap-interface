import { CHART_TYPE } from "@constants/option.constant";
import {
  TvlChartInfo,
  TvlPriceInfo,
} from "@containers/tvl-chart-container/TvlChartContainer";
import TvlChartGraph from "../tvl-chart-graph/TvlChartGraph";
import TvlChartPriceInfo from "../tvl-chart-price-info/TvlChartPriceInfo";
import TvlChartSelectTab from "../tvl-chart-select-tab/TvlChartSelectTab";
import { ChartWrapper, LoadingTVLChart, TvlChartWrapper } from "./TvlChart.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { ComponentSize } from "@hooks/common/use-component-size";
import React from "react";

interface TvlChartItemProps {
  tvlChartType: CHART_TYPE;
  tvlPriceInfo: TvlPriceInfo;
  tvlChartInfo: TvlChartInfo;
  loading: boolean;
  changeTvlChartType: (newType: string) => void;
  componentRef: React.RefObject<HTMLDivElement>;
  size: ComponentSize;
}

const TvlChart: React.FC<TvlChartItemProps> = ({
  tvlChartType,
  tvlPriceInfo,
  tvlChartInfo,
  changeTvlChartType,
  loading,
  componentRef,
  size,
}) => {
  return (
    <TvlChartWrapper>
      <TvlChartPriceInfo tvlPriceInfo={tvlPriceInfo} />
      <ChartWrapper>
        <TvlChartSelectTab
          tvlChartType={tvlChartType}
          changeTvlChartType={changeTvlChartType}
        />
        {!loading && <TvlChartGraph
          xAxisLabels={tvlChartInfo.xAxisLabels}
          datas={tvlChartInfo.datas}
          size={size}
          componentRef={componentRef}
        />}
        {loading && <LoadingTVLChart>
          <LoadingSpinner />
        </LoadingTVLChart>}
      </ChartWrapper>
    </TvlChartWrapper>
  );
};

export default TvlChart;
