import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolIncentivize, { DistributionPeriodDate } from "./PoolIncentivize";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import { PoolModel } from "@models/pool/pool-model";
import { PoolRepositoryMock } from "@repositories/pool";

const poolRepository = new PoolRepositoryMock();

export default {
  title: "incentivize/PoolIncentivize",
  component: PoolIncentivize,
} as ComponentMeta<typeof PoolIncentivize>;

const tokenA = {
  path: "0",
  name: "HEXss",
  symbol: "HEX",
  logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokenB = {
  path: "1",
  name: "USDCoin",
  symbol: "USDC",
  logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokens = [tokenA, tokenB];


const pools = (await poolRepository.getPools());

const details = (await poolRepository.getPoolDetailByPoolId()).pool;

const dummyDisclaimer = "This feature enables you to provide incentives as staking rewards for a specific liquidity pool. By adding incentives to the pool, you may draw more liquidity providers, which could lead to better price rates and increased trading activities.As the incentivizer, you can choose the type of the token and the duration of the rewards. The rewards will be automatically distributed by the contract and you will not be able to withdraw the tokens once the you complete this step.";
const periods = [90, 120, 210];

const Template: ComponentStory<typeof PoolIncentivize> = args => {
  const [startDate, setStartDate] = useState<DistributionPeriodDate>();
  const [period, setPeriod] = useState<number>(90);
  const [token, setToken] = useState<TokenBalanceInfo | null>(tokenA);
  const [pool, setPool] = useState<PoolModel | null>(null);

  const selectPool = useCallback((poolId: string) => {
    const pool = pools.find(p => p.id === poolId);
    if (pool) {
      setPool(pool);
    }
  }, []);

  const selectToken = useCallback((path: string) => {
    const token = tokens.find(token => token.path === path);
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <PoolIncentivize
      {...args}
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