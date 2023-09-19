import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquiditySelectResult from "./RemoveLiquiditySelectResult";
import { LiquidityInfoModel } from "@models/liquidity/liquidity-info-model";
import BigNumber from "bignumber.js";

const tokenPair = {
  token0: {
    tokenId: "1",
    name: "Gnoland",
    symbol: "GNOT",
    tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    amount: {
      value: BigNumber("1140.058845"),
      denom: "GNOT",
    }
  },
  token1: {
    tokenId: "2",
    name: "Gnoswap",
    symbol: "GNOS",
    tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    amount: {
      value: BigNumber("942.55884"),
      denom: "GNOS",
    }
  },
};


const liquidities: LiquidityInfoModel[] = [
  {
    liquidityId: "#14450",
    tokenPair,
    fee: tokenPair,
    amount: "145,541.10",
    feeRate: 0,
    maxRate: 0,
    minRate: 0,
    stakeType: "UNSTAKED",
    liquidityType: "PROVIDED",
  }
];

export default {
  title: "remove liquidity/RemoveLiquiditySelectResult",
  component: RemoveLiquiditySelectResult,
} as ComponentMeta<typeof RemoveLiquiditySelectResult>;

const Template: ComponentStory<typeof RemoveLiquiditySelectResult> = args => (
  <RemoveLiquiditySelectResult {...args} />
);

export const Default = Template.bind({});
Default.args = {
  selectedLiquidities: liquidities,
};
