import { RANGE_STATUS_OPTION, STAKED_OPTION } from "@constants/option.constant";
import React from "react";
import MyLiquidityDetailsCard from "@components/pool/my-liquidity-details-card/MyLiquidityDetailsCard";
import { wrapper } from "./MyLiquidityDetails.styles";

interface MyLiquidityDetailsProps {
  info: any[];
}

export const poolDetailListInit = [
  {
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
    rangeType: RANGE_STATUS_OPTION.IN,
    stakeType: STAKED_OPTION.STAKED,
    minPriceAmount: "1,105.1 GNOT per GNS",
    maxPriceAmount: "1,268.2 GNOT per GNS",
    balance: "$18,092.45",
    rewards: "$1,015.24",
    apr: "90.5%",
  },
  {
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
    rangeType: RANGE_STATUS_OPTION.OUT,
    stakeType: STAKED_OPTION.UNSTAKED,
    minPriceAmount: "1,105.1 GNOT per GNS",
    maxPriceAmount: "1,268.2 GNOT per GNS",
    balance: "$18,092.45",
    rewards: "$1,015.24",
    apr: "90.5%",
  },
  {
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
    rangeType: RANGE_STATUS_OPTION.IN,
    stakeType: STAKED_OPTION.STAKED,
    minPriceAmount: "1,105.1 GNOT per GNS",
    maxPriceAmount: "1,268.2 GNOT per GNS",
    balance: "$18,092.45",
    rewards: "$1,015.24",
    apr: "90.5%",
  },
];

const MyLiquidityDetails: React.FC<MyLiquidityDetailsProps> = ({
  info = poolDetailListInit,
}) => {
  return (
    <div css={wrapper}>
      {info.map((item, idx) => (
        <MyLiquidityDetailsCard item={item} key={idx} />
      ))}
    </div>
  );
};

export default MyLiquidityDetails;
