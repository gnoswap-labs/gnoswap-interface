import React from "react";
import { CHART_TYPE } from "@constants/option.constant";
import {
  VolumeChartInfo,
  VolumePriceInfo,
} from "@containers/volume-chart-container/VolumeChartContainer";
import VolumeChartPriceInfo from "../volume-chart-price-info/VolumeChartPriceInfo";
import VolumeChartSelectTab from "../volume-chart-select-tab/VolumeChartSelectTab";
import { VolumeChartWrapper, ChartWrapper } from "./VolumeChart.styles";
import VolumeChartGraph from "../volume-chart-graph/VolumeChartGraph";

interface VolumeChartItemProps {
  volumeChartType: CHART_TYPE;
  changeVolumeChartType: (newType: string) => void;
  volumePriceInfo: VolumePriceInfo;
  volumeChartInfo: VolumeChartInfo;
}

const VolumeChart: React.FC<VolumeChartItemProps> = ({
  volumeChartType,
  changeVolumeChartType,
  volumePriceInfo,
  volumeChartInfo,
}) => (
  <VolumeChartWrapper>
    <VolumeChartPriceInfo volumePriceInfo={volumePriceInfo} />
    <ChartWrapper>
      <VolumeChartSelectTab
        volumeChartType={volumeChartType}
        changeVolumeChartType={changeVolumeChartType}
      />
      <VolumeChartGraph
        xAxisLabels={volumeChartInfo.xAxisLabels}
        datas={volumeChartInfo.datas}
      />
    </ChartWrapper>
  </VolumeChartWrapper>
);

export default VolumeChart;
