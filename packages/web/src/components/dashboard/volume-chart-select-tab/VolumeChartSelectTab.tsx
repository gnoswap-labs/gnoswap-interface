import React from "react";
import SelectTab from "@components/common/select-tab/SelectTab";
import { VolumeChartSelectTabWrapper } from "./VolumeChartSelectTab.styles";
import { CHART_TYPE } from "@constants/option.constant";

interface VolumeChartSelectTabProps {
  volumeChartType: CHART_TYPE;
  changeVolumeChartType: (newType: string) => void;
}

const VolumeChartSelectTab: React.FC<VolumeChartSelectTabProps> = ({
  volumeChartType,
  changeVolumeChartType,
}) => (
  <VolumeChartSelectTabWrapper>
    <SelectTab
      selectType={volumeChartType}
      list={Object.values(CHART_TYPE)}
      onClick={changeVolumeChartType}
      buttonClassName={"chart-select-button"}
    />
  </VolumeChartSelectTabWrapper>
);

export default VolumeChartSelectTab;
