import React, { useCallback, useMemo, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquiditySelectList from "./RemoveLiquiditySelectList";
import LPPositionData from "@repositories/position/mock/positions.json";

export default {
  title: "remove lpPosition/RemoveLiquiditySelectList",
  component: RemoveLiquiditySelectList,
} as ComponentMeta<typeof RemoveLiquiditySelectList>;

const Template: ComponentStory<typeof RemoveLiquiditySelectList> = args => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const unstakedLiquidities = useMemo(() => {
    return args.lpPositions;
  }, [args.lpPositions]);

  const selectedAll = useMemo(() => {
    return unstakedLiquidities.length === selectedIds.length;
  }, [selectedIds.length, unstakedLiquidities.length]);

  const selectAll = useCallback(() => {
    if (selectedAll) {
      setSelectedIds([]);
      return;
    }
    const selectedIds = unstakedLiquidities.map(lpPosition => lpPosition.lpRewardId);
    setSelectedIds(selectedIds);
  }, [selectedAll, unstakedLiquidities]);

  const select = useCallback((id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId => selectedId !== id)));
      return;
    }
    setSelectedIds([...selectedIds, id]);
  }, [selectedIds]);

  return (
    <RemoveLiquiditySelectList
      {...args}
      selectedAll={selectedAll}
      selectedIds={selectedIds}
      select={select}
      selectAll={selectAll}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  lpPositions: LPPositionData.stakedPositions,
};
