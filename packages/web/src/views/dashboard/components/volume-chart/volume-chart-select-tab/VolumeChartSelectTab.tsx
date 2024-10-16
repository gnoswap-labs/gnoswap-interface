import React from "react";
import { useTranslation } from "react-i18next";

import SelectTabV2 from "@components/common/select-tab-v2/SelectTabV2";
import { CHART_TYPE } from "@constants/option.constant";

import { VolumeChartSelectTabWrapper } from "./VolumeChartSelectTab.styles";

interface VolumeChartSelectTabProps {
  volumeChartType: CHART_TYPE;
  changeVolumeChartType: ({
    display,
    key,
  }: {
    display: string;
    key: string;
  }) => void;
}

const VolumeChartSelectTab: React.FC<VolumeChartSelectTabProps> = ({
  volumeChartType,
  changeVolumeChartType,
}) => {
  const { t } = useTranslation();

  return (
    <VolumeChartSelectTabWrapper>
      <SelectTabV2
        selectType={volumeChartType}
        list={Object.values(CHART_TYPE).map(item => ({
          key: item,
          display: item === "ALL" ? t("common:all") : item,
        }))}
        onClick={changeVolumeChartType}
        buttonClassName={"chart-select-button"}
      />
    </VolumeChartSelectTabWrapper>
  );
};

export default VolumeChartSelectTab;
