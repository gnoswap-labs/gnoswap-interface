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

const token0 = {
  tokenId: "0",
  name: "HEX",
  symbol: "HEX",
  tokenLogo: "",
};

const token1 = {
  tokenId: "1",
  name: "USDCoin",
  symbol: "USDC",
  tokenLogo: "",
};

export const Default = Template.bind({});
Default.args = {
  token0: token0,
  token1: token1,
};

export const SelectableStatus = Template.bind({});
SelectableStatus.args = {
  token0: token0,
  token1: token1,
};

export const UnselectableStatus = Template.bind({});
UnselectableStatus.args = {
  token0: token0,
  token1: token1,
  disabled: true,
};
