import React from "react";
import BestPools from "@components/token/best-pools/BestPools";
import { FEE_RATE_OPTION } from "@constants/option.constant";
import { type TokenPairInfo } from "@models/token/token-pair-info";

export interface BestPool {
  tokenPair: TokenPairInfo;
  feeRate: FEE_RATE_OPTION;
  tvl: string;
  apr: string;
}

export const bestPoolsInit: BestPool = {
  tokenPair: {
    tokenA: {
      path: Math.floor(Math.random() * 50 + 1).toString(),
      name: "HEX",
      symbol: "HEX",
      logoURI:
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    },
    tokenB: {
      path: Math.floor(Math.random() * 50 + 1).toString(),
      name: "USDCoin",
      symbol: "USDC",
      logoURI:
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
  },
  feeRate: FEE_RATE_OPTION.FEE_05,
  tvl: "$12,908.25M",
  apr: "120.52%",
};

export const bestPoolListInit: BestPool[] = [
  bestPoolsInit,
  bestPoolsInit,
  bestPoolsInit,
  bestPoolsInit,
];

const BestPoolsContainer: React.FC = () => {
  return <BestPools titleSymbol={"GNOS"} cardList={bestPoolListInit} />;
};

export default BestPoolsContainer;
