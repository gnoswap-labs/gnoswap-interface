import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquiditySelectListItem from "./RemoveLiquiditySelectListItem";
import { action } from "@storybook/addon-actions";
import { LiquidityInfoModel } from "@models/liquidity/liquidity-info-model";
import BigNumber from "bignumber.js";

export default {
  title: "remove liquidity/RemoveLiquiditySelectListItem",
  component: RemoveLiquiditySelectListItem,
} as ComponentMeta<typeof RemoveLiquiditySelectListItem>;

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

const liquidity: LiquidityInfoModel = {
  liquidityId: "#14450",
  tokenPair,
  fee: tokenPair,
  amount: "145,541.10",
  feeRate: 0,
  maxRate: 0,
  minRate: 0,
  stakeType: "UNSTAKED",
  liquidityType: "PROVIDED",
};

const Template: ComponentStory<typeof RemoveLiquiditySelectListItem> = args => {
  const [selected, setSelected] = useState(false);
  return (
    <RemoveLiquiditySelectListItem
      {...args}
      selected={selected}
      select={() => setSelected(!selected)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  liquidity,
  selected: false,
  select: action("select"),
};
