import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

import TrendingCryptoCard from "./TrendingCryptoCard";

export default {
  title: "token/TrendingCryptoCard",
  component: TrendingCryptoCard,
} as ComponentMeta<typeof TrendingCryptoCard>;

const Template: ComponentStory<typeof TrendingCryptoCard> = args => (
  <TrendingCryptoCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  item: {
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
};
