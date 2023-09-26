import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquiditySelectListItem from "./RemoveLiquiditySelectListItem";
import { action } from "@storybook/addon-actions";
import LPPositionData from "@repositories/position/mock/positions.json";

export default {
  title: "remove liquidity/RemoveLiquiditySelectListItem",
  component: RemoveLiquiditySelectListItem,
} as ComponentMeta<typeof RemoveLiquiditySelectListItem>;


const Template: ComponentStory<typeof RemoveLiquiditySelectListItem> = args => {
  const [selected, setSelected] = useState(false);
  return (
    <RemoveLiquiditySelectListItem
      {...args}
      selected={selected}
      select={() => setSelected(!selected)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  lpPosition: LPPositionData.stakedPositions[0],
  selected: false,
  select: action("select"),
};
