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
import useRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { formatPrice, formatRate } from "@utils/new-number-utils";

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
  const { isLoading: isLoadingCommon } = useLoading();

  const gainersList = useMemo(() => {
    return gainers?.slice(0, 3).map((item: IGainer) => {
      const isGnotPath = item.tokenPath === wugnotPath;
      const priceChange = item.tokenPrice24hChange || 0;
      const temp: TokenModel =
        tokens.filter(
          (token: TokenModel) => token.path === item.tokenPath,
        )?.[0] || {};
      return {
        path: isGnotPath ? gnot?.path || "" : item.tokenPath,
        name: isGnotPath ? gnot?.name || "" : temp.name,
        symbol: isGnotPath ? gnot?.symbol || "" : temp.symbol,
        logoURI: isGnotPath ? gnot?.logoURI || "" : temp.logoURI,
        price: formatPrice(item.tokenPrice),
        change: {
          status:
            Number(priceChange) >= 0
              ? MATH_NEGATIVE_TYPE.POSITIVE
              : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: formatRate(priceChange, {
            showSign: true,
            allowZeroDecimals: true,
          }),
        },
      };
    });
  }, [
    gainers,
    wugnotPath,
    tokens,
    gnot?.path,
    gnot?.name,
    gnot?.symbol,
    gnot?.logoURI,
  ]);

  const loserList = useMemo(() => {
    return losers?.slice(0, 3)?.map((item: IGainer) => {
      const isGnotPath = item.tokenPath === wugnotPath;
      const priceChange = item.tokenPrice24hChange || 0;
      const temp: TokenModel =
        tokens.filter(
          (token: TokenModel) => token.path === item.tokenPath,
        )?.[0] || {};
      return {
        path: isGnotPath ? gnot?.path || "" : item.tokenPath,
        name: isGnotPath ? gnot?.name || "" : temp.name,
        symbol: isGnotPath ? gnot?.symbol || "" : temp.symbol,
        logoURI: isGnotPath ? gnot?.logoURI || "" : temp.logoURI,
        price: formatPrice(item.tokenPrice),
        change: {
          status:
            Number(priceChange) >= 0
              ? MATH_NEGATIVE_TYPE.POSITIVE
              : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: formatRate(priceChange, {
            showSign: true,
            allowZeroDecimals: true,
          }),
        },
      };
    });
  }, [
    losers,
    wugnotPath,
    tokens,
    gnot?.path,
    gnot?.name,
    gnot?.symbol,
    gnot?.logoURI,
  ]);

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
