import React, { useMemo } from "react";
import BestPools from "@components/token/best-pools/BestPools";
import { SwapFeeTierType } from "@constants/option.constant";
import { type TokenPairInfo } from "@models/token/token-pair-info";
import { useRouter } from "next/router";
import { useGetTokenDetailByPath } from "src/react-query/token";
import { IBestPoolResponse } from "@repositories/token";
import { convertLargePrice } from "@utils/stake-position-utils";

export interface BestPool {
  tokenPair: TokenPairInfo;
  feeRate: SwapFeeTierType;
  tvl: string;
  apr: string;
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
};

export const bestPoolListInit: BestPool[] = [
  bestPoolsInit,
  bestPoolsInit,
  bestPoolsInit,
  bestPoolsInit,
];

const BestPoolsContainer: React.FC = () => {
  const router = useRouter();
  const { data: { bestPools = [] } = {}, isLoading } = useGetTokenDetailByPath(router.query["tokenB"] as string, { enabled: !!router.query["tokenB"]});

  const bestPoolList: BestPool[] = useMemo(() => {
    return bestPools.map((item: IBestPoolResponse) => {
      return {
        tokenPair: {
          tokenA: {
            path: Math.floor(Math.random() * 50 + 1).toString(),
            name: "HEX",
            symbol: "HEX",
            logoURI: item.tokenALogo,
          },
          tokenB: {
            path: Math.floor(Math.random() * 50 + 1).toString(),
            name: "USDCoin",
            symbol: "USDC",
            logoURI: item.tokenBLogo,
          },
        },
        feeRate: `FEE_${item.fee}` as SwapFeeTierType,
        tvl: `$${convertLargePrice(item.tvl)}`,
        apr: `${Number(item.apr).toFixed(2)}%`,
      };
    });
  }, [bestPools]);

  return <BestPools titleSymbol={router?.query["token-path"] as string || ""} cardList={bestPoolList} loading={isLoading}/>;
};

export default BestPoolsContainer;
