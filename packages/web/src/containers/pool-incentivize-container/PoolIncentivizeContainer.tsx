import PoolIncentivize from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { FEE_RATE_OPTION } from "@constants/option.constant";
import { PoolModel } from "@models/pool/pool-model";
import { TokenBalanceModel } from "@models/token/token-balance-model";
import React, { useCallback, useState } from "react";

const dummyData = {
  tokenPair: {
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
  },
  feeRate: FEE_RATE_OPTION.FEE_3,
};

export const dummyDisclaimer =
  "Disclaimer1Disclaimer1 Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer3Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer2Disclaimer";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

const pools: PoolModel[] = [];
const tokenBalances: TokenBalanceModel[] = [];
const periods = [90, 120, 150, 180, 210, 240];

const PoolIncentivizeContainer: React.FC = () => {
  const [startDate, setStartDate] = useState<DistributionPeriodDate>();
  const [period, setPeriod] = useState(90);
  const [amount, setAmount] = useState("");
  const [currentPool, setCurrentPool] = useState<PoolModel | null>(null);
  const [currentToken, setCurrentToken] = useState<TokenBalanceModel | null>(null);

  const selectPool = useCallback((poolId: string) => {
    const pool = pools.find(pool => pool.poolId === poolId);
    if (pool) {
      setCurrentPool(pool);
    }
  }, [setCurrentPool]);

  const selectToken = useCallback((tokenId: string) => {
    const token = tokenBalances.find(token => token.tokenId === tokenId);
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
      details={dummyData}
      disclaimer={dummyDisclaimer}
      token={currentToken}
      tokens={tokenBalances}
      selectToken={selectToken}
    />
  );
};

export default PoolIncentivizeContainer;
