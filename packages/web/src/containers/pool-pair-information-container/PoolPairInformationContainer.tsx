import React from "react";
import { useRouter } from "next/router";
import PoolPairInformation from "@components/pool/pool-pair-information/PoolPairInformation";
import {
  FEE_RATE_OPTION,
  INCENTIVIZED_TYPE,
  MATH_NEGATIVE_TYPE,
} from "@constants/option.constant";

export interface pathProps {
  title: string;
  path: string;
}

export const menuInit = {
  title: "Earn",
  path: "/earn",
};

export const poolPairInit = {
  poolInfo: {
    tokenPair: {
      token0: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
        compositionPercent: "50",
        composition: "50.05881",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
      token1: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "USDCoin",
        symbol: "USDC",
        compositionPercent: "50",
        composition: "150.0255",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
    },
    token0Rate: "50%",
    token1Rate: "50%",
    feeRate: FEE_RATE_OPTION.FEE_3,
    incentivized: INCENTIVIZED_TYPE.INCENTIVIZED,
  },
  liquidity: {
    value: "$524.24m",
    change24h: {
      status: MATH_NEGATIVE_TYPE.POSITIVE || MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "+3.52%",
    },
  },
  volume24h: {
    value: "$100.24m",
    change24h: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE || MATH_NEGATIVE_TYPE.POSITIVE,
      value: "-3.52%",
    },
  },
  apr: {
    value: "✨108.21%",
    fees: "-3.52%",
    rewards: "88.13%",
  },
} as const;
export type poolPairProps = typeof poolPairInit;
export type poolInfoProps = (typeof poolPairInit)["poolInfo"];
export type liquidityProps = (typeof poolPairInit)["liquidity"];

const PoolPairInformationContainer = () => {
  const router = useRouter();

  const onClickPath = (path: string) => {
    router.push(path);
  };

  return (
    <PoolPairInformation
      info={poolPairInit}
      menu={menuInit}
      onClickPath={onClickPath}
    />
  );
};

export default PoolPairInformationContainer;
