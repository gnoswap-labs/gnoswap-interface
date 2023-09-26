import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectPair from "./SelectPair";

export default {
  title: "common/AddLiquidity/SelectPair",
  component: SelectPair,
} as ComponentMeta<typeof SelectPair>;

const Template: ComponentStory<typeof SelectPair> = args => (
  <SelectPair {...args} />
);

const tokenA = {
  path: "0",
  name: "HEX",
  symbol: "HEX",
  logoURI: "",
};

const tokenB = {
  path: "1",
  name: "USDCoin",
  symbol: "USDC",
  logoURI: "",
};

export const Default = Template.bind({});
Default.args = {
  tokenA: tokenA,
  tokenB: tokenB,
};

export const SelectableStatus = Template.bind({});
SelectableStatus.args = {
  tokenA: tokenA,
  tokenB: tokenB,
};

export const UnselectableStatus = Template.bind({});
UnselectableStatus.args = {
  tokenA: tokenA,
  tokenB: tokenB,
  disabled: true,
};
