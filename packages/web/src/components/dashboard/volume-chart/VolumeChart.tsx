import React from "react";
import { CHART_TYPE } from "@constants/option.constant";
import {
  VolumeChartInfo,
  VolumePriceInfo,
} from "@containers/volume-chart-container/VolumeChartContainer";
import VolumeChartPriceInfo from "../volume-chart-price-info/VolumeChartPriceInfo";
import VolumeChartSelectTab from "../volume-chart-select-tab/VolumeChartSelectTab";
import { VolumeChartWrapper, ChartWrapper, LoadingVolumnChart } from "./VolumeChart.styles";
import VolumeChartGraph from "../volume-chart-graph/VolumeChartGraph";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface VolumeChartItemProps {
  volumeChartType: CHART_TYPE;
  changeVolumeChartType: (newType: string) => void;
  volumePriceInfo: VolumePriceInfo;
  volumeChartInfo: VolumeChartInfo;
  loading: boolean;
}

const VolumeChart: React.FC<VolumeChartItemProps> = ({
  volumeChartType,
  changeVolumeChartType,
  volumePriceInfo,
  volumeChartInfo,
  loading,
}) => (
  <VolumeChartWrapper>
    <VolumeChartPriceInfo volumePriceInfo={volumePriceInfo} />
    <ChartWrapper>
      <VolumeChartSelectTab
        volumeChartType={volumeChartType}
        changeVolumeChartType={changeVolumeChartType}
      />
      {!loading && <VolumeChartGraph
        xAxisLabels={volumeChartInfo.xAxisLabels}
        datas={volumeChartInfo.datas}
        times={volumeChartInfo.times}
      />}
      {loading && <LoadingVolumnChart>
        <LoadingSpinner />
      </LoadingVolumnChart>}
    </ChartWrapper>
  </VolumeChartWrapper>
);

export default VolumeChart;
