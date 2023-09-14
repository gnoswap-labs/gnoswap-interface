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
      tokenId: "USDCoin",
      name: "USDCoin",
      symbol: "USDC",
      tokenLogo:
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    amount: "121",
    price: "$0.00",
    balance: "0",
  },
  to: {
    token: {
      tokenId: "HEX",
      name: "HEX",
      symbol: "HEX",
      tokenLogo:
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    },
    amount: "5000",
    price: "$0.00",
    balance: "0",
  },
  connected: true,
  connectWallet: action("connectWallet"),
  swapNow: action("swapNow"),
};
