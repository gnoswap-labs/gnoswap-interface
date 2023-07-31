import React from "react";
import SelectTab from "@components/common/select-tab/SelectTab";
import { TokenChartGraphTabWrapper } from "./TokenChartGraphTab.styles";
import { TokenChartGraphPeriods, TokenChartGraphPeriodType } from "@containers/token-chart-container/TokenChartContainer";

export interface TokenChartGraphTabProps {
  currentTab: TokenChartGraphPeriodType;
  changeTab: (tab: string) => void;
}
const TokenChartGraphTab: React.FC<TokenChartGraphTabProps> = ({
  currentTab,
  changeTab
}) => {
  return (
    <TokenChartGraphTabWrapper>
      <SelectTab
        selectType={currentTab}
        list={[...TokenChartGraphPeriods]}
        onClick={changeTab}
        buttonClassName={"chart-select-button"}
      />
    </TokenChartGraphTabWrapper>
  );
};

export default TokenChartGraphTab;