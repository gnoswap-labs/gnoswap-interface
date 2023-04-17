import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyLiquidityHeader from "./MyLiquidityHeader";
import { liquidityInit } from "@containers/my-liquidity-container/MyLiquidityContainer";

export default {
  title: "pool/MyLiquidityHeader",
  component: MyLiquidityHeader,
} as ComponentMeta<typeof MyLiquidityHeader>;

const Template: ComponentStory<typeof MyLiquidityHeader> = args => (
  <MyLiquidityHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  info: liquidityInit.poolInfo,
};
