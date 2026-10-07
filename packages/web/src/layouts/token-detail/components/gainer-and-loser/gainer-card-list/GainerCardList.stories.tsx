import type { Meta, StoryObj } from "@storybook/nextjs";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

import GainerCardList from "./GainerCardList";

export const gainersInit = [
  {
    path: "1",
    name: "HEX",
    symbol: "HEX",
    displaySymbol: "HEX",
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
    displaySymbol: "USDC",
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
    displaySymbol: "BTC",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
];

const meta = {
  title: "token/GainerCardList",
  component: GainerCardList,
  tags: ["autodocs"],
} satisfies Meta<typeof GainerCardList>;

export default meta;
type Story = StoryObj<typeof GainerCardList>;

export const Default: Story = {
  args: {
    gainers: gainersInit,
  },
};
