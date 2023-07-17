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

const selectPairInit = {
  token0: {
    tokenId: Math.floor(Math.random() * 50 + 1).toString(),
    name: "HEX",
    symbol: "HEX",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  },
  token1: {
    tokenId: Math.floor(Math.random() * 50 + 1).toString(),
    name: "USDCoin",
    symbol: "USDC",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
};

export const Default = Template.bind({});
Default.args = {
  active: true,
  data: null,
};

export const SelectableStatus = Template.bind({});
SelectableStatus.args = {
  active: true,
  data: selectPairInit,
};

export const UnselectableStatus = Template.bind({});
UnselectableStatus.args = {
  active: false,
  data: selectPairInit,
};
