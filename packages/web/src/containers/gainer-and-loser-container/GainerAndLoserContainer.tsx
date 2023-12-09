import React, { useMemo } from "react";
import GainerAndLoser from "@components/token/gainer-and-loser/GainerAndLoser";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGetChainList, useGetTokensList } from "src/react-query/token";
import { TokenModel } from "@models/token/token-model";
import { IGainer } from "@repositories/token";
import { convertLargePrice } from "@utils/stake-position-utils";

export const gainersInit = [
  {
    path: "1",
    name: "HEX",
    symbol: "HEX",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-17.43%",
    },
  },
  {
    path: "2",
    name: "USDCoin",
    symbol: "USDC",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
  {
    path: "1",
    name: "Bitcoin",
    symbol: "BTC",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
];

export const losersInit = [
  {
    path: "1",
    name: "Bitcoin",
    symbol: "BTC",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-17.43%",
    },
  },
  {
    path: "2",
    name: "USDCoin",
    symbol: "USDC",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
  {
    path: "1",
    name: "HEX",
    symbol: "HEX",
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    price: "$12,908.25",
    change: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-17.43%",
    },
  },
];

const GainerAndLoserContainer: React.FC = () => {
  const { data: { tokens = [] } = {}, isLoading: isLoadingListToken } = useGetTokensList();
  const { data: { gainers = [], losers = [] } = {}, isLoading } = useGetChainList();

  const gainersList = useMemo(() => {
    return gainers.map((item: IGainer) => {
      const temp: TokenModel = tokens.filter((token: TokenModel) => token.path === item.tokenPath)?.[0] || {};
      return {
        path: item.tokenPath,
        name: temp.name,
        symbol: temp.symbol,
        logoURI: temp.logoURI,
        price: `$${convertLargePrice(item.tokenPrice)}`,
        change: {
          status: MATH_NEGATIVE_TYPE.POSITIVE,
          value: "+0.00%",
        }
      };
    }).slice(0, 3);
  }, [tokens, gainers]);

  const loserList = useMemo(() => {
    return losers.map((item: IGainer) => {
      const temp: TokenModel = tokens.filter((token: TokenModel) => token.path === item.tokenPath)?.[0] || {};
      return {
        path: item.tokenPath,
        name: temp.name,
        symbol: temp.symbol,
        logoURI: temp.logoURI,
        price: `$${convertLargePrice(item.tokenPrice)}`,
        change: {
          status: MATH_NEGATIVE_TYPE.POSITIVE,
          value: "+0.00%",
        }
      };
    }).slice(0, 3);
  }, [tokens, losers]);

  return <GainerAndLoser
      gainers={gainersList}
      losers={loserList}
      loadingLose={isLoading || isLoadingListToken}
      loadingGain={isLoading || isLoadingListToken}
    />;
};

export default GainerAndLoserContainer;
