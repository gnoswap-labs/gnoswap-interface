import React from "react";

import SelectTab from "@components/common/select-tab/SelectTab";

import { ChartScopeSelectTabWrapper } from "./ChartScopeSelectTab.styles";

export type TAB_SIZE = "MEDIUM" | "SMALL";

interface ChartScopeSelectTabProps<T> {
  selected: T;
  onChange: (newType: T) => void;
  list: T[]
  size: TAB_SIZE;
}

const ChartScopeSelectTab = <T extends string>({
  selected,
  onChange,
  list,
  size,
}: React.PropsWithChildren<ChartScopeSelectTabProps<T>>) => (
  <ChartScopeSelectTabWrapper $hasBorder size={size}>
    <SelectTab
      selectType={selected}
      list={list}
      onClick={(value) => onChange(value as T)}
      buttonClassName={"tab-button"}
    />
  </ChartScopeSelectTabWrapper>
);

export default ChartScopeSelectTab;
