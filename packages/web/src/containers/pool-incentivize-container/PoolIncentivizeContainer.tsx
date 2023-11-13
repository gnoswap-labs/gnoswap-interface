import PoolIncentivize from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolModel } from "@models/pool/pool-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import React, { useCallback, useEffect, useState } from "react";
import PoolDetailData from "@repositories/pool/mock/pool-detail.json";
import POOLS from "@repositories/pool/mock/pools.json";
export const dummyDisclaimer =
  "This feature enables you to provide incentives as staking rewards for a specific liquidity pool. By adding incentives to the pool, you may draw more liquidity providers, which could lead to better price rates and increased trading On-chain Activities.<br /><br />As the incentivizer, you can choose the type of the token and the duration of the rewards. The rewards will be automatically distributed by the contract and you will not be able to withdraw the tokens once the you complete this step.";

const DefaultDate = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  date: new Date().getDate(),
};
interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

const pools: PoolModel[] = POOLS.pools;
const tokenBalances: TokenBalanceInfo[] = [];
const periods = [90, 180, 365];

const PoolIncentivizeContainer: React.FC = () => {
  const [startDate, setStartDate] = useState<DistributionPeriodDate>(DefaultDate);
  const [period, setPeriod] = useState(90);
  const [amount, setAmount] = useState("");
  const [currentPool, setCurrentPool] = useState<PoolModel | null>(null);
  const [currentToken, setCurrentToken] = useState<TokenBalanceInfo | null>(null);
  const [poolDetail, setPoolDetail] = useState<PoolDetailModel | null>(null);

  useEffect(() => {
    setPoolDetail(PoolDetailData.pool);
  }, []);

  const selectPool = useCallback((poolId: string) => {
    const pool = pools.find(pool => pool.id === poolId);
    if (pool) {
      setCurrentPool(pool);
    }
  }, [setCurrentPool]);

  const selectToken = useCallback((path: string) => {
    const token = tokenBalances.find(token => token.path === path);
    if (token) {
      setCurrentToken(token);
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
      pools={pools}
      selectedPool={currentPool}
      selectPool={selectPool}
      startDate={startDate}
      setStartDate={setStartDate}
      periods={periods}
      period={period}
      setPeriod={setPeriod}
      amount={amount}
      onChangeAmount={onChangeAmount}
      details={poolDetail}
      disclaimer={dummyDisclaimer}
      token={currentToken}
      tokens={tokenBalances}
      selectToken={selectToken}
    />
  );
};

export default PoolIncentivizeContainer;
