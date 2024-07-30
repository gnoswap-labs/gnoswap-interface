import React from "react";
import { TvlChartSelectTabWrapper } from "./TvlChartSelectTab.styles";
import { CHART_TYPE } from "@constants/option.constant";
import SelectTabV2 from "@components/common/select-tab-v2/SelectTabV2";
import { useTranslation } from "react-i18next";

interface TvlChartSelectTabProps {
  tvlChartType: CHART_TYPE;
  changeTvlChartType: ({
    display,
    key,
  }: {
    display: string;
    key: string;
  }) => void;
}

const TvlChartSelectTab: React.FC<TvlChartSelectTabProps> = ({
  tvlChartType,
  changeTvlChartType,
}) => {
  const { t } = useTranslation();

  return (
    <TvlChartSelectTabWrapper>
      <SelectTabV2
        selectType={tvlChartType}
        list={Object.values(CHART_TYPE).map(item => ({
          key: item,
          display: item === "ALL" ? t("common:all") : item,
        }))}
        onClick={changeTvlChartType}
        buttonClassName={"chart-select-button"}
      />
    </TvlChartSelectTabWrapper>
  );
};

export default TvlChartSelectTab;
