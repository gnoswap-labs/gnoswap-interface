import { CHART_TYPE } from "@constants/option.constant";
import {
  TvlChartInfo,
  TvlPriceInfo,
} from "@containers/tvl-chart-container/TvlChartContainer";
import TvlChartGraph from "../tvl-chart-graph/TvlChartGraph";
import TvlChartPriceInfo from "../tvl-chart-price-info/TvlChartPriceInfo";
import TvlChartSelectTab from "../tvl-chart-select-tab/TvlChartSelectTab";
import { ChartWrapper, TvlChartWrapper } from "./TvlChart.styles";

interface TvlChartItemProps {
  tvlChartType: CHART_TYPE;
  tvlPriceInfo: TvlPriceInfo;
  tvlChartInfo: TvlChartInfo;
  changeTvlChartType: (newType: string) => void;
}

const TvlChart: React.FC<TvlChartItemProps> = ({
  tvlChartType,
  tvlPriceInfo,
  tvlChartInfo,
  changeTvlChartType,
}) => {
  return (
    <TvlChartWrapper>
      <TvlChartPriceInfo tvlPriceInfo={tvlPriceInfo} />
      <ChartWrapper>
        <TvlChartSelectTab
          tvlChartType={tvlChartType}
          changeTvlChartType={changeTvlChartType}
        />
        <TvlChartGraph
          xAxisLabels={tvlChartInfo.xAxisLabels}
          datas={tvlChartInfo.datas}
        />
      </ChartWrapper>
    </TvlChartWrapper>
  );
};

export default TvlChart;
