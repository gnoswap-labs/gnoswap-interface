import React from "react";
import { CHART_TYPE } from "@constants/option.constant";
import { VolumePriceInfo } from "@containers/volume-chart-container/VolumeChartContainer";
import VolumeChartInfo from "../volume-chart-info/VolumeChartInfo";
import VolumeChartPriceInfo from "../volume-chart-price-info/VolumeChartPriceInfo";
import VolumeChartSelectTab from "../volume-chart-select-tab/VolumeChartSelectTab";
import { VolumeChartWrapper, ChartWrapper } from "./VolumeChart.styles";

interface VolumeChartItemProps {
  volumeChartType: CHART_TYPE;
  changeVolumeChartType: (newType: string) => void;
  volumePriceInfo: VolumePriceInfo;
}

const VolumeChart: React.FC<VolumeChartItemProps> = ({
  volumeChartType,
  changeVolumeChartType,
  volumePriceInfo,
}) => (
  <VolumeChartWrapper>
    <VolumeChartPriceInfo volumePriceInfo={volumePriceInfo} />
    <ChartWrapper>
      <VolumeChartSelectTab
        volumeChartType={volumeChartType}
        changeVolumeChartType={changeVolumeChartType}
      />
      <VolumeChartInfo />
    </ChartWrapper>
  </VolumeChartWrapper>
);

export default VolumeChart;
