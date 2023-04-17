import React from "react";
import MyLiquidity from "@components/pool/my-liquidity/MyLiquidity";
import { FEE_RATE_OPTION } from "@constants/option.constant";

export const liquidityInit = {
  poolInfo: {
    tokenPair: {
      token0: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
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
  },
  totalBalance: "$1.24m",
  dailyEarn: "$954.52",
  claimRewards: "$3,052.59",
};

const MyLiquidityContainer: React.FC = () => {
  return <MyLiquidity info={liquidityInit} />;
};

export default MyLiquidityContainer;
