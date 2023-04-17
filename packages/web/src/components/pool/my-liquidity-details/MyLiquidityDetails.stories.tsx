import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyLiquidityDetails, { poolDetailListInit } from "./MyLiquidityDetails";

export default {
  title: "pool/MyLiquidityDetails",
  component: MyLiquidityDetails,
} as ComponentMeta<typeof MyLiquidityDetails>;

const Template: ComponentStory<typeof MyLiquidityDetails> = args => (
  <MyLiquidityDetails {...args} />
);

export const Default = Template.bind({});
Default.args = {
  info: poolDetailListInit,
};
