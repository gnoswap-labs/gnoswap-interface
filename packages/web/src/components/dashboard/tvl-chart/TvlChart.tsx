import { CHART_TYPE } from "@constants/option.constant";
import {
  TvlChartData,
  TvlPriceInfo,
} from "@containers/tvl-chart-container/TvlChartContainer";
import TvlChartGraph from "../tvl-chart-graph/TvlChartGraph";
import TvlChartPriceInfo from "../tvl-chart-price-info/TvlChartPriceInfo";
import TvlChartSelectTab from "../tvl-chart-select-tab/TvlChartSelectTab";
import {
  ChartWrapper,
  LoadingTVLChart,
  TvlChartWrapper,
} from "./TvlChart.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

export interface TvlChartItemProps {
  tvlChartType: CHART_TYPE;
  tvlPriceInfo: TvlPriceInfo;
  tvlChartDatas: TvlChartData;
  loading: boolean;
  changeTvlChartType: ({
    display,
    key,
  }: {
    display: string;
    key: string;
  }) => void;
}

const TvlChart: React.FC<TvlChartItemProps> = ({
  tvlChartType,
  tvlPriceInfo,
  tvlChartDatas,
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
        {!loading && (
          <TvlChartGraph datas={tvlChartDatas} tvlChartType={tvlChartType} />
        )}
        {loading && (
          <LoadingTVLChart>
            <LoadingSpinner />
          </LoadingTVLChart>
        )}
      </ChartWrapper>
    </TvlChartWrapper>
  );
};

export default TvlChart;
