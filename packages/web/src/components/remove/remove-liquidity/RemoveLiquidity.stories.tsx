import React, { useCallback, useMemo, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquidity from "./RemoveLiquidity";
import LPPositionData from "@repositories/position/mock/positions.json";

export default {
  title: "remove position/RemoveLiquidity",
  component: RemoveLiquidity,
} as ComponentMeta<typeof RemoveLiquidity>;

const Template: ComponentStory<typeof RemoveLiquidity> = (args) => {
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
    const selectedIds = unstakedLiquidities.map(position => position.lpRewardId);
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
    <RemoveLiquidity
      {...args}
      selectedAll={selectedAll}
      selectedIds={selectedIds}
      select={select}
      selectAll={selectAll} />
  );
};

export const Default = Template.bind({});
Default.args = {
  lpPositions: LPPositionData.stakedPositions
};
