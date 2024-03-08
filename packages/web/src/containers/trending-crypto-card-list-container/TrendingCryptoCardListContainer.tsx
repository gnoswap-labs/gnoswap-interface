import React, { useMemo } from "react";
import TrendingCryptoCardList from "@components/token/trending-crypto-card-list/TrendingCryptoCardList";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import {
  useGetChainList,
  useGetTokenDetailByPath,
  useGetTokensList,
} from "@query/token";
import { ITrending } from "@repositories/token";
import { TokenModel } from "@models/token/token-model";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useRouter } from "next/router";
import { useGetPoolList } from "@query/pools";
import { toUnitFormat } from "@utils/number-utils";
import { useLoading } from "@hooks/common/use-loading";

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
  const { data: { tokens = [] } = {}, isLoading: isLoadingListToken } =
    useGetTokensList();
  const { data: { trending = [] } = {}, isLoading } = useGetChainList();
  const { gnot, wugnotPath } = useGnotToGnot();
  const router = useRouter();
  const path = router.query["tokenB"] as string;
  const { isLoading: isLoadingTokenDetail } = useGetTokenDetailByPath(
    path === "gnot" ? wugnotPath : path,
    { enabled: !!path },
  );
  const { isLoading: isLoadingGetPoolList } = useGetPoolList();
  const { isLoadingCommon } = useLoading();

  const trendingCryptoList = useMemo(() => {
    return trending.map((item: ITrending) => {
      const temp: TokenModel = tokens.filter((token: TokenModel) => token.path === item.tokenPath)?.[0] || {};
      return {
        path: item.tokenPath === wugnotPath ? (gnot?.path || "") : item.tokenPath,
        name: item.tokenPath === wugnotPath ? (gnot?.name || "") : temp.name,
        symbol: item.tokenPath === wugnotPath ? (gnot?.symbol || "") : temp.symbol,
        logoURI: item.tokenPath === wugnotPath ? (gnot?.logoURI || "") : temp.logoURI,
        price: `${(toUnitFormat(item.tokenPrice, true, false))}`,
        change: {
          status: Number(item.tokenPriceChange) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${Number(item.tokenPriceChange) >= 0 ? "+" : ""}${Number(item.tokenPriceChange).toFixed(2)}%`,
        }
      };
    }).slice(0, 5);
  }, [tokens, trending, gnot, wugnotPath]);

  return (
    <TrendingCryptoCardList
      list={trendingCryptoList}
      loading={
        isLoading ||
        isLoadingListToken ||
        isLoadingTokenDetail ||
        isLoadingGetPoolList ||
        isLoadingCommon
      }
    />
  );
};

export default TrendingCryptoCardListContainer;
