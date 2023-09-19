import { PoolSelectItemModel } from "@models/pool/pool-select-item-model";
import PoolIncentivizeSelectPoolItem, { type PoolIncentivizeSelectPoolItemProps } from "./PoolIncentivizeSelectPoolItem";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";

const Template: React.FC<PoolIncentivizeSelectPoolItemProps> = (args) => {
  return (
    <div style={{ backgroundColor: "#141A29" }}>
      <PoolIncentivizeSelectPoolItem {...args} />
    </div>
  );
};

export default {
  title: "incentivize/PoolIncentivizeSelectPoolItem",
  component: Template,

} as Meta<typeof PoolIncentivizeSelectPoolItem>;

const tokenPair = {
  token0: {
    tokenId: Math.floor(Math.random() * 50 + 1).toString(),
    name: "HEX",
    symbol: "HEX",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  },
  token1: {
    tokenId: Math.floor(Math.random() * 50 + 1).toString(),
    name: "USDCoin",
    symbol: "USDC",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
};

const poolSelectItem: PoolSelectItemModel = {
  poolId: "1",
  tokenPair,
  feeRate: 0.2,
  liquidityAmount: "14201",
};

export const Default: StoryObj<PoolIncentivizeSelectPoolItemProps> = {
  args: {
    poolSelectItem,
    visibleLiquidity: false
  },
};