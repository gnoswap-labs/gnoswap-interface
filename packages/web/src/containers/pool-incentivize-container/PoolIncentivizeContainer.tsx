import PoolIncentivize from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolModel } from "@models/pool/pool-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import React, { useCallback, useEffect, useState } from "react";
import PoolDetailData from "@repositories/pool/mock/pool-detail.json";
export const dummyDisclaimer =
  "This feature enables you to provide incentives as staking rewards for a specific liquidity pool. Before you proceed, ensure that you understand the mechanics of external incentives and acknowledge that you cannot withdraw the rewards once you complete this step.";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

const pools: PoolModel[] = [];
const tokenBalances: TokenBalanceInfo[] = [];
const periods = [90, 120, 150, 180, 210, 240];

const PoolIncentivizeContainer: React.FC = () => {
  const [startDate, setStartDate] = useState<DistributionPeriodDate>();
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
