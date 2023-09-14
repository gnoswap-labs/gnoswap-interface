import React from "react";
import {
  ComponentStory,
  ComponentMeta
} from "@storybook/react";

import EnterAmounts from "./LiquidityEnterAmounts";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/AddLiquidity/EnterAmounts",
  component: EnterAmounts,
} as ComponentMeta<typeof EnterAmounts>;

const Template: ComponentStory<typeof EnterAmounts> = args => (
  <EnterAmounts {...args} />
);

const token = {
  tokenId: "1",
  name: "HEX",
  symbol: "HEX",
  tokenLogo:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
};

export const Default = Template.bind({});
Default.args = {
  token0Input: {
    token: token,
    amount: "121",
    usdValue: "$0.00",
    balance: "0",
    changeAmount: action("changeAmount"),
    changeBalance: action("changeBalance"),
  },
  token1Input: {
    token: token,
    amount: "121",
    usdValue: "$0.00",
    balance: "0",
    changeAmount: action("changeAmount"),
    changeBalance: action("changeBalance"),
  },
  changeToken0: action("changeToken0"),
  changeToken1: action("changeToken1"),
};
