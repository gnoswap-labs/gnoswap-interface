import React, { useMemo } from "react";
import { useRouter } from "next/router";
import PoolPairInformation from "@components/pool/pool-pair-information/PoolPairInformation";
import {
  FEE_RATE_OPTION,
  INCENTIVIZED_TYPE,
  MATH_NEGATIVE_TYPE,
} from "@constants/option.constant";
import { useGetPoolDetailByPath } from "src/react-query/pools";

export interface pathProps {
  title: string;
  path: string;
}

export const menuInit = {
  title: "Earn",
  path: "/earn",
};

export const poolPairInit = {
  poolInfo: {
    tokenPair: {
      tokenA: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX" as string,
        symbol: "HEX" as string,
        compositionPercent: "50" as string,
        composition: "50.05881" as string,
        amount: {
          value: "18,500.18" as string,
          denom: "gnot" as string,
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png" as string,
      },
      tokenB: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "USDCoin" as string,
        symbol: "USDC" as string,
        compositionPercent: "50" as string,
        composition: "150.0255" as string,
        amount: {
          value: "18,500.18" as string,
          denom: "gnot" as string,
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" as string,
      },
    },
    token0Rate: "50%" as string,
    token1Rate: "50%" as string,
    feeRate: FEE_RATE_OPTION.FEE_1 as any,
    incentivized: INCENTIVIZED_TYPE.INCENTIVIZED,
  },
  liquidity: {
    value: "$524.24m" as string,
    change24h: {
      status: MATH_NEGATIVE_TYPE.POSITIVE || MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "+3.52%" as string,
    },
  },
  volume24h: {
    value: "$100.24m" as string,
    change24h: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE || MATH_NEGATIVE_TYPE.POSITIVE,
      value: "-3.52%" as string,
    },
  },
  apr: {
    value: "108.21%" as string,
    fees: "-3.52%" as string,
    rewards: "88.13%" as string,
  },
} as const;
export type poolPairProps = typeof poolPairInit;
export type poolInfoProps = (typeof poolPairInit)["poolInfo"];
export type liquidityProps = (typeof poolPairInit)["liquidity"];

// function extractFee(input: string): number | null {
//   const match = input.match(/_(\d+)$/);

  
//   if (match) {
//     return parseInt(match[1], 10);
//   }

//   return null;
// }

const PoolPairInformationContainer = () => {
  const router = useRouter();
  const { path } = router.query;
  const { data } = useGetPoolDetailByPath(path as string, { enabled: !!path });

  const poolPairInfo = useMemo(() => {
    if (data) {
      return {
        ...poolPairInit,
        poolInfo: {
          ...poolPairInit.poolInfo,
          tokenPair: {
            tokenA: {
              path: data.tokenA.path,
              name: data.tokenA.name,
              symbol: data.tokenA.symbol,
              compositionPercent: "50",
              composition: "50.05881",
              amount: {
                value: "18,500.18",
                denom: "gnot",
              },
              logoURI: data.tokenA.logoURI,
            },
            tokenB: {
              path: data.tokenB.path,
              name: data.tokenB.name,
              symbol: data.tokenB.symbol,
              compositionPercent: "50",
              composition: "150.0255",
              amount: {
                value: "18,500.18",
                denom: "gnot",
              },
              logoURI: data.tokenB.logoURI,
            },
          },
          feeRate: `${Number(data.fee) / 10000}`,
        },
      };
    }
    return poolPairInit;
  }, [data]);
  const onClickPath = (path: string) => {
    router.push(path);
  };

  if (!data) return null;
  return (
    <PoolPairInformation
      info={poolPairInfo}
      menu={menuInit}
      onClickPath={onClickPath}
      fee={Number((path as string)?.split(":")?.[2]) ?? 1}
    />
  );
};

export default PoolPairInformationContainer;
