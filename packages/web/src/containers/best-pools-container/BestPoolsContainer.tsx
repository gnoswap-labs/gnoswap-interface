import React, { useMemo } from "react";
import BestPools from "@components/token/best-pools/BestPools";
import { SwapFeeTierType } from "@constants/option.constant";
import { type TokenPairInfo } from "@models/token/token-pair-info";
import { useRouter } from "next/router";
import {
  useGetChainList,
  useGetTokenByPath,
  useGetTokenDetailByPath,
  useGetTokensList,
} from "@query/token";
import { IBestPoolResponse } from "@repositories/token";
import { useGetPoolList } from "src/react-query/pools";
import { PoolModel } from "@models/pool/pool-model";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useLoading } from "@hooks/common/use-loading";
import { toUnitFormat } from "@utils/number-utils";
import { numberToRate } from "@utils/string-utils";

export interface BestPool {
  tokenPair: TokenPairInfo;
  feeRate: SwapFeeTierType;
  tvl: string;
  apr: string;
  id: string;
  poolPath: string;
}

export const bestPoolsInit: BestPool = {
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
  tvl: "$129.25M",
  feeRate: "FEE_100",
  apr: "120.52%",
  id: "",
  poolPath: "",
};

export const bestPoolListInit: BestPool[] = [
  bestPoolsInit,
  bestPoolsInit,
  bestPoolsInit,
  bestPoolsInit,
];

const BestPoolsContainer: React.FC = () => {
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();
  const router = useRouter();
  const path = router.query["token-path"] as string;
  const { data: { bestPools = [] } = {}, isLoading } = useGetTokenDetailByPath(
    path === "gnot" ? wugnotPath : path,
    { enabled: !!path },
  );
  const { data: pools = [], isLoading: isLoadingGetPoolList } =
    useGetPoolList();
  const { data: tokenB } = useGetTokenByPath(path, { enabled: !!path });
  const { isLoading: isLoadingChainList } = useGetChainList();
  const { isLoading: isLoadingListToken } = useGetTokensList();
  const { isLoadingCommon } = useLoading();

  const bestPoolList: BestPool[] = useMemo(() => {
    return (bestPools ?? []).map((item: IBestPoolResponse) => {
      const temp =
        pools.filter(
          (_item: PoolModel) => _item.poolPath === item.poolPath,
        )?.[0] || {};

      return {
        tokenPair: {
          tokenA: {
            path: getGnotPath(item.tokenA).path,
            name: getGnotPath(item.tokenA).name,
            symbol: getGnotPath(item.tokenA).symbol,
            logoURI: getGnotPath(item.tokenA).logoURI,
          },
          tokenB: {
            path: getGnotPath(item.tokenB).path,
            name: getGnotPath(item.tokenB).name,
            symbol: getGnotPath(item.tokenB).symbol,
            logoURI: getGnotPath(item.tokenB).logoURI,
          },
        },
        poolPath: temp?.poolPath || "",
        id: temp?.id || "",
        feeRate: `FEE_${item.fee}` as SwapFeeTierType,
        tvl: `${toUnitFormat(item.tvlUsd, true, true)}`,
        apr: numberToRate(item.apr),
      };
    });
  }, [bestPools, pools.toString(), gnot, wugnotPath]);

  return (
    <BestPools
      titleSymbol={tokenB?.symbol || ""}
      cardList={bestPoolList}
      loading={
        isLoading ||
        isLoadingGetPoolList ||
        isLoadingChainList ||
        isLoadingListToken ||
        isLoadingCommon
      }
    />
  );
};

export default BestPoolsContainer;
