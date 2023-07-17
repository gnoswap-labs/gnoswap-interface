import PoolIncentivize from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { FEE_RATE_OPTION } from "@constants/option.constant";
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

const PoolIncentivizeContainer: React.FC = () => {
  const [startDate, setStartDate] = useState<DistributionPeriodDate>();
  const [endDate, setEndDate] = useState<DistributionPeriodDate>();
  const [amount, setAmount] = useState("");

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmount(value);
    },
    [],
  );

  return (
    <PoolIncentivize
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      amount={amount}
      onChangeAmount={onChangeAmount}
      details={dummyData}
      disclaimer={dummyDisclaimer}
    />
  );
};

export default PoolIncentivizeContainer;
