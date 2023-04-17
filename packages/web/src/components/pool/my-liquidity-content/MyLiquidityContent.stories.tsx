import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyLiquidityContent from "./MyLiquidityContent";
import { liquidityInit } from "@containers/my-liquidity-container/MyLiquidityContainer";

export default {
  title: "pool/MyLiquidityContent",
  component: MyLiquidityContent,
} as ComponentMeta<typeof MyLiquidityContent>;

const Template: ComponentStory<typeof MyLiquidityContent> = args => (
  <MyLiquidityContent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  content: liquidityInit,
};
