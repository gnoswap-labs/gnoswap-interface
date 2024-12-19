import { useCallback, useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PoolModel } from "@models/pool/pool-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import { PoolRepositoryMock } from "@repositories/pool";
import { DistributionPeriodDate } from "@states/earn";

import PoolIncentivize from "./PoolIncentivize";

const poolRepository = new PoolRepositoryMock();

export default {
  title: "incentivize/PoolIncentivize",
  component: PoolIncentivize,
} as ComponentMeta<typeof PoolIncentivize>;

const tokenA = {
  path: "0",
  name: "HEXss",
  symbol: "HEX",
  logoURI:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokenB = {
  path: "1",
  name: "USDCoin",
  symbol: "USDC",
  logoURI:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokens = [tokenA, tokenB];

const pools = await poolRepository.getPools();

const details = await poolRepository.getPoolDetailByPoolPath();

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
};
