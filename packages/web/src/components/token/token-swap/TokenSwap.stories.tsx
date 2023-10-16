import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenSwap from "./TokenSwap";
import { action } from "@storybook/addon-actions";

export default {
  title: "token/TokenSwap",
  component: TokenSwap,
} as ComponentMeta<typeof TokenSwap>;

const Template: ComponentStory<typeof TokenSwap> = args => (
  <TokenSwap {...args} />
);

export const Default = Template.bind({});
Default.args = {
  from: {
    token: {
      chainId: "dev",
      createdAt: "2023-10-10T08:48:46+09:00",
      name: "Gnoswap",
      address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
      path: "gno.land/r/gnos",
      decimals: 4,
      symbol: "GNOS",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
      priceId: "gno.land/r/gnos"
    },
    amount: "121",
    price: "$0.00",
    balance: "0",
  },
  to: {
    token: {
      chainId: "dev",
      createdAt: "2023-10-10T08:48:46+09:00",
      name: "Gnoswap",
      address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
      path: "gno.land/r/gnos",
      decimals: 4,
      symbol: "GNOS",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
      priceId: "gno.land/r/gnos"
    },
    amount: "5000",
    price: "$0.00",
    balance: "0",
  },
  connected: true,
  connectWallet: action("connectWallet"),
  swapNow: action("swapNow"),
};
