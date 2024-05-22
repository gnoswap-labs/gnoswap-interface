import React, { useMemo } from "react";
import GainerAndLoser from "@components/token/gainer-and-loser/GainerAndLoser";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import {
  useGetChainList,
  useGetTokenDetailByPath,
  useGetTokensList,
} from "@query/token";
import { TokenModel } from "@models/token/token-model";
import { IGainer } from "@repositories/token";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetPoolList } from "@query/pools";
import { useRouter } from "next/router";
import { toPriceFormat } from "@utils/number-utils";
import { useLoading } from "@hooks/common/use-loading";
import BigNumber from "bignumber.js";

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
  const { data: { tokens = [] } = {}, isLoading: isLoadingListToken } =
    useGetTokensList();
  const { data: { gainers = [], losers = [] } = {}, isLoading } =
    useGetChainList();
  const { gnot, wugnotPath } = useGnotToGnot();
  const router = useRouter();
  const path = router.query["token-path"] as string;
  const { isLoading: isLoadingGetPoolList } = useGetPoolList();
  const { isLoading: isLoadingTokenDetail } = useGetTokenDetailByPath(
    path === "gnot" ? wugnotPath : path,
    {
      enabled: !!path,
    },
  );
  const { isLoadingCommon } = useLoading();

  const gainersList = useMemo(() => {
    return (gainers ?? [])?.map((item: IGainer) => {
      const temp: TokenModel = tokens.filter((token: TokenModel) => token.path === item.tokenPath)?.[0] || {};
      return {
        path: item.tokenPath === wugnotPath ? (gnot?.path || "") : item.tokenPath,
        name: item.tokenPath === wugnotPath ? (gnot?.name || "") : temp.name,
        symbol: item.tokenPath === wugnotPath ? (gnot?.symbol || "") : temp.symbol,
        logoURI: item.tokenPath === wugnotPath ? (gnot?.logoURI || "") : temp.logoURI,
        price: `${(toPriceFormat(BigNumber(item.tokenPrice).toFormat(), { usd: true }))}`,
        change: {
          status: Number(item.tokenPrice24hChange) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${Number(item.tokenPrice24hChange) >= 0 ? "+" : ""}${Number(item.tokenPrice24hChange).toFixed(2)}%`,
        }
      };
    }).slice(0, 3);
  }, [tokens, gainers]);

  const loserList = useMemo(() => {
    return (losers ?? [])?.map((item: IGainer) => {
      const temp: TokenModel = tokens.filter((token: TokenModel) => token.path === item.tokenPath)?.[0] || {};
      return {
        path: item.tokenPath === wugnotPath ? (gnot?.path || "") : item.tokenPath,
        name: item.tokenPath === wugnotPath ? (gnot?.name || "") : temp.name,
        symbol: item.tokenPath === wugnotPath ? (gnot?.symbol || "") : temp.symbol,
        logoURI: item.tokenPath === wugnotPath ? (gnot?.logoURI || "") : temp.logoURI,
        price: `${toPriceFormat(BigNumber(item.tokenPrice).toFormat(), { usd: true })}`,
        change: {
          status: Number(item.tokenPrice24hChange) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${Number(item.tokenPrice24hChange) >= 0 ? "+" : ""}${Number(item.tokenPrice24hChange).toFixed(2)}%`,
        }
      };
    }).slice(0, 3);
  }, [tokens, losers]);

  return (
    <GainerAndLoser
      gainers={gainersList}
      losers={loserList}
      loadingLose={
        isLoading ||
        isLoadingListToken ||
        isLoadingGetPoolList ||
        isLoadingTokenDetail ||
        isLoadingCommon
      }
      loadingGain={
        isLoading ||
        isLoadingListToken ||
        isLoadingGetPoolList ||
        isLoadingTokenDetail ||
        isLoadingCommon
      }
    />
  );
};

export default GainerAndLoserContainer;
