import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquiditySelectResult from "./RemoveLiquiditySelectResult";
import PositionData from "@repositories/position/mock/positions.json";


export default {
  title: "remove liquidity/RemoveLiquiditySelectResult",
  component: RemoveLiquiditySelectResult,
} as ComponentMeta<typeof RemoveLiquiditySelectResult>;

const Template: ComponentStory<typeof RemoveLiquiditySelectResult> = args => (
  <RemoveLiquiditySelectResult {...args} />
);

export const Default = Template.bind({});
Default.args = {
  selectedLiquidities: PositionData.stakedPositions,
};
