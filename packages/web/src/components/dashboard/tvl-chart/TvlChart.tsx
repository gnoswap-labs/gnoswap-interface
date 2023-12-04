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

interface TvlChartItemProps {
  tvlChartType: CHART_TYPE;
  tvlPriceInfo: TvlPriceInfo;
  tvlChartInfo: TvlChartInfo;
  loading: boolean;
  changeTvlChartType: (newType: string) => void;
}

const TvlChart: React.FC<TvlChartItemProps> = ({
  tvlChartType,
  tvlPriceInfo,
  tvlChartInfo,
  changeTvlChartType,
  loading,
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
        />}
        {loading && <LoadingTVLChart>
          <LoadingSpinner />
        </LoadingTVLChart>}
      </ChartWrapper>
    </TvlChartWrapper>
  );
};

export default TvlChart;
