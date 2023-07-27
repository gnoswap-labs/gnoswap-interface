import React from "react";
import SelectTab from "@components/common/select-tab/SelectTab";
import { TvlChartSelectTabWrapper } from "./TvlChartSelectTab.styles";
import { CHART_TYPE } from "@constants/option.constant";

interface TvlChartSelectTabProps {
  tvlChartType: CHART_TYPE;
  changeTvlChartType: (newType: string) => void;
}

const TvlChartSelectTab: React.FC<TvlChartSelectTabProps> = ({
  tvlChartType,
  changeTvlChartType,
}) => (
  <TvlChartSelectTabWrapper>
    <SelectTab
      selectType={tvlChartType}
      list={Object.values(CHART_TYPE)}
      onClick={changeTvlChartType}
      buttonClassName={"chart-select-button"}
    />
  </TvlChartSelectTabWrapper>
);

export default TvlChartSelectTab;
