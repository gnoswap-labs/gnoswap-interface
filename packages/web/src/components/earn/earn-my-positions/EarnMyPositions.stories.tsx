import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositions from "./EarnMyPositions";
import { action } from "@storybook/addon-actions";
import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";

export default {
  title: "earn/EarnMyPositions",
  component: EarnMyPositions,
} as ComponentMeta<typeof EarnMyPositions>;

const Template: ComponentStory<typeof EarnMyPositions> = args => (
  <EarnMyPositions {...args} />
);

export const position: PoolPosition = {
  tokenPair: {
    tokenA: {
      path: Math.floor(Math.random() * 50 + 1).toString(),
      name: "HEX",
      symbol: "HEX",
      amount: {
        value: "18,500.18",
        denom: "gnot",
      },
      logoURI:
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    },
    tokenB: {
      path: Math.floor(Math.random() * 50 + 1).toString(),
      name: "USDCoin",
      symbol: "USDC",
      amount: {
        value: "18,500.18",
        denom: "gnot",
      },
      logoURI:
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
  },
  rewards: [
    {
      token: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
      amount: {
        value: "18,500.18",
        denom: "gnot",
      },
    },
  ],
  feeRate: "0.05%",
  stakeType: "Staked",
  value: "$18,500.10",
  apr: "108.21%",
  inRange: true,
  currentPriceAmount: "1184.24 GNOS per ETH",
  minPriceAmount: "1.75 GNOT Per GNOS",
  maxPriceAmount: "2.25 GNOT Per GNOS",
  currentTick: 4,
  minTick: 40,
  maxTick: 200,
  minLabel: "-30%",
  maxLabel: "50%",
  ticks: ["1", "1", "2", "2", "3", "3", "2", "2", "1", "1"]
};

export const UnConnected = Template.bind({});
UnConnected.args = {
  connected: false,
  fetched: true,
  positions: [],
  connect: action("connect"),
  moveEarnAdd: action("moveEarnAdd"),
  movePoolDetail: action("movePoolDetail"),
};

export const NoLiquidity = Template.bind({});
NoLiquidity.args = {
  connected: true,
  fetched: true,
  positions: [],
  connect: action("connect"),
  moveEarnAdd: action("moveEarnAdd"),
  movePoolDetail: action("movePoolDetail"),
};

export const CardList = Template.bind({});
CardList.args = {
  connected: true,
  fetched: true,
  positions: [position, position],
  connect: action("connect"),
  moveEarnAdd: action("moveEarnAdd"),
  movePoolDetail: action("movePoolDetail"),
};
