import PoolIncentivize from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolModel } from "@models/pool/pool-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import React, { useCallback, useEffect, useState } from "react";
import PoolDetailData from "@repositories/pool/mock/pool-detail.json";
import POOLS from "@repositories/pool/mock/pools.json";
import { useIncentivizePoolModal } from "@hooks/incentivize/use-incentivize-pool-modal";
import { TokenModel } from "@models/token/token-model";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
export const dummyDisclaimer =
  "This feature enables you to provide incentives as staking rewards for a specific liquidity pool. Before you proceed, ensure that you understand the mechanics of external incentives and acknowledge that you cannot withdraw the rewards once you complete this step.<br /><br />The incentives you add will be automatically distributed by the contract and may draw more liquidity providers.";

const DefaultDate = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  date: new Date().getDate() + 1,
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
  const [currentPool, setCurrentPool] = useState<PoolModel | null>(null);
  const [currentToken, setCurrentToken] = useState<TokenBalanceInfo | null>(null);
  const [poolDetail, setPoolDetail] = useState<PoolDetailModel | null>(null);
  const [token, setToken] = useState<TokenModel | null>(null);
  const tokenAmountInput = useTokenAmountInput(token);

  const { openModal } = useIncentivizePoolModal();

  const changeToken = useCallback((token: TokenModel) => {
    setToken(token);
  }, []);

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

  const handleConfirmIncentivize = useCallback(() => {
    openModal();
  }, []);

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
      details={poolDetail}
      disclaimer={dummyDisclaimer}
      token={currentToken}
      tokens={tokenBalances}
      selectToken={selectToken}
      handleConfirmIncentivize={handleConfirmIncentivize}
      tokenAmountInput={tokenAmountInput}
      changeToken={changeToken}
    />
  );
};

export default PoolIncentivizeContainer;
