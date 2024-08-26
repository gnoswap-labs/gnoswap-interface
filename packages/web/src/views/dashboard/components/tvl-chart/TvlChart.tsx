import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { CHART_TYPE } from "@constants/option.constant";

import TvlChartGraph from "./tvl-chart-graph/TvlChartGraph";
import TvlChartPriceInfo, { TvlPriceInfo } from "./tvl-chart-price-info/TvlChartPriceInfo";
import TvlChartSelectTab from "./tvl-chart-select-tab/TvlChartSelectTab";

import {
  ChartWrapper,
  LoadingTVLChart,
  TvlChartWrapper,
} from "./TvlChart.styles";

export type TvlChartData = {
  amount: {
    value: string;
    denom: string;
  };
  time: string;
}[];

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
