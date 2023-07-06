import React, { useCallback, useState } from "react";
import { type FeeOptions } from "@common/values/data-constant";
import PoolList from "@components/earn/pool-list/PoolList";
import { type TokenPairModel } from "@models/token/token-pair-model";
import { useQuery } from "@tanstack/react-query";
import { ValuesType } from "utility-types";

export interface Pool {
  poolId: string;
  tokenPair: TokenPairModel;
  feeRate: FeeOptions;
  liquidity: string;
  apr: string;
  volume24h: string;
  fees24h: string;
  rewards: Array<string>;
  incentiveType: POOL_TYPE;
}

export const TABLE_HEAD = {
  POOL_NAME: "Pool Name",
  LIQUIDITY: "Liquidity",
  VOLUME: "Volume (24h)",
  FEES: "Fees (24h)",
  APR: "APR",
  REWARDS: "Rewards",
} as const;

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const POOL_TYPE = {
  ALL: "All",
  INCENTIVIZED: "Incentivized",
  NON_INCENTIVIZED: "Non-Incentivized",
} as const;

export type POOL_TYPE = ValuesType<typeof POOL_TYPE>;

export const dummyPoolList: Pool[] = [
  {
    poolId: Math.floor(Math.random() * 50 + 1).toString(),
    tokenPair: {
      token0: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
      token1: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "USDCoin",
        symbol: "USDC",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
    },
    feeRate: "0.01%",
    liquidity: "$12,090.41M",
    apr: "$311,421.12M",
    volume24h: "$311,421.12M",
    fees24h: "$311,421.12M",
    rewards: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
    ],
    incentiveType: POOL_TYPE.INCENTIVIZED,
  },
  {
    poolId: "2",
    tokenPair: {
      token0: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
      token1: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "USDCoin",
        symbol: "USDC",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
    },
    feeRate: "0.05%",
    liquidity: "$12,090.41M",
    apr: "$311,421.12M",
    volume24h: "$311,421.12M",
    fees24h: "$311,421.12M",
    rewards: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4E15361FD6b4BB609Fa63C81A2be19d873717870/logo.png",
      "https://assets.coingecko.com/coins/images/29223/large/Favicon_200x200px.png?1677480836",
    ],
    incentiveType: POOL_TYPE.ALL,
  },
  {
    poolId: "3",
    tokenPair: {
      token0: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
      token1: {
        tokenId: Math.floor(Math.random() * 50 + 1).toString(),
        name: "USDCoin",
        symbol: "USDC",
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
    },
    feeRate: "0.3%",
    liquidity: "$12,090.41M",
    apr: "$311,421.12M",
    volume24h: "$311,421.12M",
    fees24h: "$311,421.12M",
    rewards: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4E15361FD6b4BB609Fa63C81A2be19d873717870/logo.png",
      "https://assets.coingecko.com/coins/images/29223/large/Favicon_200x200px.png?1677480836",
    ],
    incentiveType: POOL_TYPE.NON_INCENTIVIZED,
  },
];

async function fetchPools(
  type: POOL_TYPE,  // eslint-disable-line
  page: number,     // eslint-disable-line
  keyword: string,  // eslint-disable-line
): Promise<Pool[]> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    Promise.resolve([
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
      ...dummyPoolList,
    ]),
  );
}

const PoolListContainer: React.FC = () => {
  const [poolType, setPoolType] = useState<POOL_TYPE>(POOL_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");

  const {
    isFetched,
    error,
    data: pools,
  } = useQuery<Pool[], Error>({
    queryKey: ["pools", poolType, page, keyword],
    queryFn: () => fetchPools(poolType, page, keyword),
  });

  const changePoolType = useCallback((newType: string) => {
    switch (newType) {
      case POOL_TYPE.ALL:
        setPoolType(POOL_TYPE.ALL);
        break;
      case POOL_TYPE.INCENTIVIZED:
        setPoolType(POOL_TYPE.INCENTIVIZED);
        break;
      case POOL_TYPE.NON_INCENTIVIZED:
        setPoolType(POOL_TYPE.NON_INCENTIVIZED);
        break;
      default:
        setPoolType(POOL_TYPE.ALL);
    }
  }, []);

  const search = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <PoolList
      pools={pools ?? []}
      isFetched={isFetched}
      error={error}
      poolType={poolType}
      changePoolType={changePoolType}
      search={search}
      keyword={keyword}
      currentPage={page}
      totalPage={100}
      movePage={movePage}
    />
  );
};

export default PoolListContainer;
