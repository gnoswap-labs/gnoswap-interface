import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolIncentivize, { DistributionPeriodDate } from "./PoolIncentivize";
import { FEE_RATE_OPTION } from "@constants/option.constant";
import { TokenBalanceModel } from "@models/token/token-balance-model";
import { PoolModel } from "@models/pool/pool-model";

export default {
  title: "incentivize/PoolIncentivize",
  component: PoolIncentivize,
} as ComponentMeta<typeof PoolIncentivize>;

const token0 = {
  tokenId: "0",
  name: "HEXss",
  symbol: "HEX",
  tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const token1 = {
  tokenId: "1",
  name: "USDCoin",
  symbol: "USDC",
  tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokens = [token0, token1];

const details = {
  tokenPair: {
    token0,
    token1,
  },
  feeRate: FEE_RATE_OPTION.FEE_3,
};

const poolSelectItem: PoolModel = {
  poolId: "1",
  liquidity: {
    token0,
    token1
  },
  feeRate: 0.2,
  incentivizedType: "EXTERNAL_INCENTIVIZED",
  rewards: []
};

const dummyDisclaimer = "This feature enables you to provide incentives as staking rewards for a specific liquidity pool. By adding incentives to the pool, you may draw more liquidity providers, which could lead to better price rates and increased trading activities.As the incentivizer, you can choose the type of the token and the duration of the rewards. The rewards will be automatically distributed by the contract and you will not be able to withdraw the tokens once the you complete this step.";
const pools = [poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem, poolSelectItem];
const periods = [90, 120, 210];

const Template: ComponentStory<typeof PoolIncentivize> = args => {
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState<DistributionPeriodDate>();
  const [period, setPeriod] = useState<number>(90);
  const [token, setToken] = useState<TokenBalanceModel | null>(token0);
  const [pool, setPool] = useState<PoolModel | null>(null);

  const selectPool = useCallback((poolId: string) => {
    const pool = pools.find(p => p.poolId === poolId);
    if (pool) {
      setPool(pool);
    }
  }, []);

  const selectToken = useCallback((tokenId: string) => {
    const token = tokens.find(token => token.tokenId === tokenId);
    if (token) {
      setToken(token);
    }
  }, []);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmount(value);
    },
    [],
  );
  return (
    <PoolIncentivize
      {...args}
      amount={amount}
      onChangeAmount={onChangeAmount}
      startDate={startDate}
      period={period}
      periods={periods}
      setPeriod={setPeriod}
      setStartDate={setStartDate}
      token={token}
      tokens={tokens}
      selectToken={selectToken}
      pools={pools}
      selectedPool={pool}
      selectPool={selectPool}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  details,
  disclaimer: dummyDisclaimer,
}; 