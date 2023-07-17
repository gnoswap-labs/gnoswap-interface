import React, { useCallback, useState } from "react";
import TokenList from "@components/home/token-list/TokenList";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { type TokenDefaultModel } from "@models/token/token-default-model";
import { type TokenPairModel } from "@models/token/token-pair-model";
import { useQuery } from "@tanstack/react-query";
import { ValuesType } from "utility-types";

interface NegativeStatusType {
  status: MATH_NEGATIVE_TYPE;
  value: string;
}
export interface MostLiquidPool {
  poolId: string;
  tokenPair: TokenPairModel;
  feeRate: string;
}
export interface Token {
  tokenId: string;
  token: TokenDefaultModel;
  price: string;
  priceOf1d: NegativeStatusType;
  priceOf7d: NegativeStatusType;
  priceOf30d: NegativeStatusType;
  marketCap: string;
  liquidity: string;
  volume24h: string;
  mostLiquidPool: MostLiquidPool;
  last7days: number[];
}

export interface SortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
}

export const TABLE_HEAD = {
  INDEX: "#",
  NAME: "Name",
  PRICE: "Price",
  PRICE_OF_1D: "1d",
  PRICE_OF_7D: "7d",
  PRICE_OF_30D: "30d",
  MARKET_CAP: "Market Cap",
  LIQUIDITY: "Liquidity",
  VOLUME: "Volume (24h)",
  MOST_LIQUID_POOL: "Most Liquid Pool",
  LAST_7_DAYS: "Last 7 days",
} as const;
export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const TOKEN_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;
export type TOKEN_TYPE = ValuesType<typeof TOKEN_TYPE>;

const SORT_PARAMS: { [key in TABLE_HEAD]: string } = {
  "#": "index",
  "Name": "name",
  "Price": "price",
  "1d": "1d",
  "7d": "7d",
  "30d": "30d",
  "Market Cap": "market_cap",
  "Liquidity": "liquidity",
  "Volume (24h)": "volume",
  "Most Liquid Pool": "most_liquidity_pool",
  "Last 7 days": "last_7_days"
};

export const dummyTokenList: Token[] = [
  {
    tokenId: Math.floor(Math.random() * 50 + 1).toString(),
    token: {
      tokenId: "1",
      name: "Bitcoin",
      symbol: "BTC",
      tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "12.08%",
    },
    priceOf7d: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "19.92%",
    },
    priceOf30d: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "19.12%",
    },
    marketCap: "$311,421,241,255",
    liquidity: "$1,421,241,255",
    volume24h: "$311,421,241",
    mostLiquidPool: {
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
      feeRate: "0.05%",
    },
    last7days: [1, 2, 3],
  },
];

async function fetchTokens(
  type: TOKEN_TYPE, // eslint-disable-line
  page: number, // eslint-disable-line
  keyword: string, // eslint-disable-line
  sortKey?: string, // eslint-disable-line
  direction?: string, // eslint-disable-line
): Promise<Token[]> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    Promise.resolve([
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
    ]),
  );
}

const TokenListContainer: React.FC = () => {
  const [tokenType, setTokenType] = useState<TOKEN_TYPE>(TOKEN_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>();

  const {
    isFetched,
    error,
    data: tokens,
  } = useQuery<Token[], Error>({
    queryKey: ["tokens", tokenType, page, keyword, sortOption?.key, sortOption?.direction],
    queryFn: () => fetchTokens(tokenType, page, keyword, sortOption && SORT_PARAMS[sortOption.key], sortOption?.direction),
  });

  const changeTokenType = useCallback((newType: string) => {
    switch (newType) {
      case TOKEN_TYPE.ALL:
        setTokenType(TOKEN_TYPE.ALL);
        break;
      case TOKEN_TYPE.GRC20:
        setTokenType(TOKEN_TYPE.GRC20);
        break;
      default:
        setTokenType(TOKEN_TYPE.ALL);
    }
  }, []);

  const search = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const isSortOption = useCallback((head: TABLE_HEAD) => {
    const disableItems = ["Most Liquid Pool", "Last 7 days"];
    return !disableItems.includes(head);
  }, []);

  const sort = useCallback((item: TABLE_HEAD) => {
    const key = item;
    const direction = sortOption?.key !== item ?
      "desc" :
      sortOption.direction === "asc" ? "desc" : "asc";

    setSortOption({
      key,
      direction,
    });
  }, [sortOption]);

  return (
    <TokenList
      tokens={tokens ?? []}
      isFetched={isFetched}
      error={error}
      tokenType={tokenType}
      sortOption={sortOption}
      changeTokenType={changeTokenType}
      search={search}
      keyword={keyword}
      currentPage={page}
      totalPage={100}
      movePage={movePage}
      isSortOption={isSortOption}
      sort={sort}
    />
  );
};

export default TokenListContainer;
