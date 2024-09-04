import React from "react";

import SelectTab from "@components/common/select-tab/SelectTab";

import { TokenChartGraphTabWrapper } from "./TokenChartGraphTab.styles";

export interface TokenChartGraphTabProps {
  tabs: Readonly<string[]>;
  currentTab: string;
  changeTab: (tab: string) => void;
}
const TokenChartGraphTab: React.FC<TokenChartGraphTabProps> = ({
  tabs,
  currentTab,
  changeTab
}) => {
  return (
    <TokenChartGraphTabWrapper>
      <SelectTab
        selectType={currentTab}
        list={[...tabs]}
        onClick={changeTab}
        buttonClassName={"chart-select-button"}
      />
    </TokenChartGraphTabWrapper>
  );
};

export default TokenChartGraphTab;