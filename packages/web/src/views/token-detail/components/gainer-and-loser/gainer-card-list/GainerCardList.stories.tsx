import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

import GainerCardList from "./GainerCardList";

export const gainersInit = [
  {
    path: "1",
    name: "HEX",
    symbol: "HEX",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-17.43%",
    },
  },
  {
    path: "2",
    name: "USDCoin",
    symbol: "USDC",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
  {
    path: "1",
    name: "Bitcoin",
    symbol: "BTC",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
];

export default {
  title: "token/GainerCardList",
  component: GainerCardList,
} as ComponentMeta<typeof GainerCardList>;

const Template: ComponentStory<typeof GainerCardList> = args => (
  <GainerCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  gainers: gainersInit,
};