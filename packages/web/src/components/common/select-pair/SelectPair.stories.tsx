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
  tokenLogo:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
};

const token1 = {
  tokenId: "1",
  name: "USDCoin",
  symbol: "USDC",
  tokenLogo:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
};

export const Default = Template.bind({});
Default.args = {
  token0: token0,
  token1: token1,
  changeToken0: undefined,
  changeToken1: undefined,
};

export const SelectableStatus = Template.bind({});
SelectableStatus.args = {
  token0: token0,
  token1: token1,
  changeToken0: undefined,
  changeToken1: undefined,
};

export const UnselectableStatus = Template.bind({});
UnselectableStatus.args = {
  token0: token0,
  token1: token1,
  changeToken0: undefined,
  changeToken1: undefined,
  disabled: true,
};
