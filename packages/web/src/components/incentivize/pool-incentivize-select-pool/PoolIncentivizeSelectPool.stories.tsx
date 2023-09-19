import { PoolSelectItemModel } from "@models/pool/pool-select-item-model";
import PoolIncentivizeSelectPool from "./PoolIncentivizeSelectPool";
import { ComponentStory, Meta } from "@storybook/react";
import { useCallback, useState } from "react";

export default {
  title: "incentivize/PoolIncentivizeSelectPool",
  component: PoolIncentivizeSelectPool,
} as Meta<typeof PoolIncentivizeSelectPool>;

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

const pools = [poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem];


const Template: ComponentStory<typeof PoolIncentivizeSelectPool> = args => {
  const [selectedPool, setSelectedPool] = useState<PoolSelectItemModel | null>(null);

  const select = useCallback((poolId: string) => {
    const pool = pools.find(p => p.poolId === poolId);
    if (pool) {
      setSelectedPool(pool);
    }
  }, []);

  return (
    <PoolIncentivizeSelectPool
      {...args}
      selectedPool={selectedPool}
      select={select}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  pools
};