import React, { useCallback, useState } from "react";
import { type FeeOptions } from "@common/values/data-constant";
import PoolList from "@components/earn/pool-list/PoolList";
import { type TokenPairInfo } from "@models/token/token-pair-info";
import { useQuery } from "@tanstack/react-query";
import { ValuesType } from "utility-types";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { useRouter } from "next/router";
import { generateBarAreaDatas } from "@common/utils/test-util";

export interface Pool {
  poolId: string;
  tokenPair: TokenPairInfo;
  feeRate: FeeOptions;
  liquidity: string;
  apr: string;
  volume24h: string;
  fees24h: string;
  rewards: Array<string>;
  incentiveType: POOL_TYPE;
  tickInfo: {
    ticks: string[];
    currentTick: number;
  };
}

export interface PoolSortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
}

export const TABLE_HEAD = {
  POOL_NAME: "Pool Name",
  LIQUIDITY: "Liquidity",
  VOLUME: "Volume (24h)",
  FEES: "Fees (24h)",
  APR: "APR",
  REWARDS: "Rewards",
  LIQUIDITY_PLOT: "Liquidity Plot",
} as const;

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const POOL_TYPE = {
  ALL: "All",
  INCENTIVIZED: "Incentivized",
  NON_INCENTIVIZED: "Non-Incentivized",
} as const;

export type POOL_TYPE = ValuesType<typeof POOL_TYPE>;

const SORT_PARAMS: { [key in TABLE_HEAD]: string } = {
  "Pool Name": "name",
  Liquidity: "liquidity",
  "Volume (24h)": "volume",
  "Fees (24h)": "fees",
  APR: "apr",
  Rewards: "rewards",
  "Liquidity Plot": "liquidity_plot",
};

export const dummyPoolList: Pool[] = [
  {
    poolId: Math.floor(Math.random() * 50 + 1).toString(),
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
    tickInfo: {
      currentTick: 22,
      ticks: generateBarAreaDatas()
    }
  },
  {
    poolId: "2",
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
    tickInfo: {
      currentTick: 29,
      ticks: generateBarAreaDatas()
    }
  },
  {
    poolId: "3",
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
    tickInfo: {
      currentTick: 14,
      ticks: generateBarAreaDatas()
    }
  },
];

async function fetchPools(
  type: POOL_TYPE, // eslint-disable-line
  page: number, // eslint-disable-line
  keyword: string, // eslint-disable-line
  sortKey?: string, // eslint-disable-line
  direction?: string, // eslint-disable-line
): Promise<Pool[]> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    Promise.resolve([
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
  const [sortOption, setTokenSortOption] = useState<PoolSortOption>();
  const [searchIcon, setSearchIcon] = useState(false);
  const [breakpoint] = useAtom(CommonState.breakpoint);
  const router = useRouter();

  const routeItem = (id: number) => {
    router.push(`/earn/pool/${id}`);
  };
  const onTogleSearch = () => {
    setSearchIcon(prev => !prev);
  };

  const {
    isFetched,
    error,
    data: pools,
  } = useQuery<Pool[], Error>({
    queryKey: [
      "pools",
      poolType,
      page,
      keyword,
      sortOption?.key,
      sortOption?.direction,
    ],
    queryFn: () =>
      fetchPools(
        poolType,
        page,
        keyword,
        sortOption && SORT_PARAMS[sortOption.key],
        sortOption?.direction,
      ),
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

  const sort = useCallback(
    (item: TABLE_HEAD) => {
      const key = item;
      const direction =
        sortOption?.key !== item
          ? "desc"
          : sortOption.direction === "asc"
            ? "desc"
            : "asc";

      setTokenSortOption({
        key,
        direction,
      });
    },
    [sortOption],
  );

  const isSortOption = useCallback((head: TABLE_HEAD) => {
    const disableItems = ["Rewards", "Liquidity Plot"];
    return !disableItems.includes(head);
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
      sortOption={sortOption}
      sort={sort}
      isSortOption={isSortOption}
      breakpoint={breakpoint}
      routeItem={routeItem}
      searchIcon={searchIcon}
      onTogleSearch={onTogleSearch}
    />
  );
};

export default PoolListContainer;
