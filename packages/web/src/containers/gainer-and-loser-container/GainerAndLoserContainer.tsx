import React from "react";
import GainerAndLoser from "@components/token/gainer-and-loser/GainerAndLoser";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

export const gainersInit = [
  {
    tokenId: "1",
    name: "HEX",
    symbol: "HEX",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-17.43%",
    },
  },
  {
    tokenId: "2",
    name: "USDCoin",
    symbol: "USDC",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
  {
    tokenId: "1",
    name: "Bitcoin",
    symbol: "BTC",
    tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
];

export const losersInit = [
  {
    tokenId: "1",
    name: "Bitcoin",
    symbol: "BTC",
    tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-17.43%",
    },
  },
  {
    tokenId: "2",
    name: "USDCoin",
    symbol: "USDC",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
  {
    tokenId: "1",
    name: "HEX",
    symbol: "HEX",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-17.43%",
    },
  },
];

const GainerAndLoserContainer: React.FC = () => {
  return <GainerAndLoser gainers={gainersInit} losers={losersInit} />;
};

export default GainerAndLoserContainer;
