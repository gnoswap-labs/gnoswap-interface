import React, { useMemo } from "react";
import TrendingCryptoCardList from "@components/token/trending-crypto-card-list/TrendingCryptoCardList";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGetChainList, useGetTokensList } from "src/react-query/token";
import { ITrending } from "@repositories/token";
import { TokenModel } from "@models/token/token-model";
import { convertLargePrice } from "@utils/stake-position-utils";

const trendingCryptoInit = [
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
];

export const trendingCryptoListInit = [
  ...trendingCryptoInit,
  ...trendingCryptoInit,
  trendingCryptoInit[0],
];

const TrendingCryptoCardListContainer: React.FC = () => {
  const { data: { tokens = [] } = {}, isLoading: isLoadingListToken } = useGetTokensList();
  const { data: { trending = [] } = {}, isLoading } = useGetChainList();
  
  const trendingCryptoList = useMemo(() => {
    return trending.map((item: ITrending) => {
      const temp: TokenModel = tokens.filter((token: TokenModel) => token.path === item.tokenPath)?.[0] || {};
      return {
        path: item.tokenPath,
        name: temp.name,
        symbol: temp.symbol,
        logoURI: temp.logoURI,
        price: `$${convertLargePrice(item.tokenPrice)}`,
        change: {
          status: Number(item.tokenPriceChange) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${Number(item.tokenPriceChange) >= 0 ? "+" : ""}${Number(item.tokenPriceChange).toFixed(2)}%`,
        }
      };
    }).slice(0, 5);
  }, [tokens, trending]);

  return <TrendingCryptoCardList list={trendingCryptoList} loading={isLoading || isLoadingListToken} />;
};

export default TrendingCryptoCardListContainer;
