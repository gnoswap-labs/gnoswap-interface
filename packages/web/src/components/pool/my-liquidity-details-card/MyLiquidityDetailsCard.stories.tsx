import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyLiquidityDetailsCard from "./MyLiquidityDetailsCard";
import { poolDetailListInit } from "@components/pool/my-liquidity-details/MyLiquidityDetails";

export default {
  title: "pool/MyLiquidityDetailsCard",
  component: MyLiquidityDetailsCard,
} as ComponentMeta<typeof MyLiquidityDetailsCard>;

const Template: ComponentStory<typeof MyLiquidityDetailsCard> = args => (
  <MyLiquidityDetailsCard {...args} />
);

export const Staked = Template.bind({});
Staked.args = {
  item: poolDetailListInit[0],
};

export const UnStaked = Template.bind({});
UnStaked.args = {
  item: poolDetailListInit[1],
};
