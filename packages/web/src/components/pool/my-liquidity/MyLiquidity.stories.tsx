import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyLiquidity from "./MyLiquidity";
import { liquidityInit } from "@containers/my-liquidity-container/MyLiquidityContainer";

export default {
  title: "pool/MyLiquidity",
  component: MyLiquidity,
} as ComponentMeta<typeof MyLiquidity>;

const Template: ComponentStory<typeof MyLiquidity> = args => (
  <MyLiquidity {...args} />
);

export const Default = Template.bind({});
Default.args = {
  info: liquidityInit,
};
