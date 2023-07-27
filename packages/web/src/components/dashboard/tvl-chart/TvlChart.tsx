import { CHART_TYPE } from "@constants/option.constant";
import { TvlPriceInfo } from "@containers/tvl-chart-container/TvlChartContainer";
import TvlChartInfo from "../tvl-chart-info/TvlChartInfo";
import TvlChartPriceInfo from "../tvl-chart-price-info/TvlChartPriceInfo";
import TvlChartSelectTab from "../tvl-chart-select-tab/TvlChartSelectTab";
import { ChartWrapper, TvlChartWrapper } from "./TvlChart.styles";

interface TvlChartItemProps {
  tvlChartType: CHART_TYPE;
  tvlPriceInfo: TvlPriceInfo;
  changeTvlChartType: (newType: string) => void;
}

const TvlChart: React.FC<TvlChartItemProps> = ({
  tvlChartType,
  tvlPriceInfo,
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
        <TvlChartInfo />
      </ChartWrapper>
    </TvlChartWrapper>
  );
};

export default TvlChart;
