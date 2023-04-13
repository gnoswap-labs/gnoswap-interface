import React from "react";
import TrendingCryptoCardList from "@components/token/trending-crypto-card-list/TrendingCryptoCardList";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

const trendingCryptoInit = [
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
];

export const trendingCryptoListInit = [
  ...trendingCryptoInit,
  ...trendingCryptoInit,
  ...trendingCryptoInit,
];

const TrendingCryptoCardListContainer: React.FC = () => {
  return <TrendingCryptoCardList list={trendingCryptoListInit} />;
};

export default TrendingCryptoCardListContainer;
