import type { Meta, StoryObj } from "@storybook/nextjs";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

import TrendingCryptoCard from "./TrendingCryptoCard";

const meta = {
  title: "token/TrendingCryptoCard",
  component: TrendingCryptoCard,
  tags: ["autodocs"],
} satisfies Meta<typeof TrendingCryptoCard>;

export default meta;
type Story = StoryObj<typeof TrendingCryptoCard>;

export const Default: Story = {
  args: {
    item: {
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
  },
};
