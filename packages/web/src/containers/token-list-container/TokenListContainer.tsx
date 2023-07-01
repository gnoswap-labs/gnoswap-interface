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

export const TABLE_HEAD = {
  INDEX: "#",
  NAME: "Name",
  PRICE: "Price",
  PRICE_OF_1D: "1d",
  PRICE_OF_7D: "7d",
  PRICE_OF_30D: "30d",
  MARKET_CAP: "Market Cap",
  LIQUIDITY: "Liquidity",
  VOLUMN: "Volumn (24h)",
  MOST_LIQUID_POOL: "Most Liquid Pool",
  LAST_7_DAYS: "Last 7 days",
} as const;
export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const TOKEN_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;
export type TOKEN_TYPE = ValuesType<typeof TOKEN_TYPE>;

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type: TOKEN_TYPE,
  page: number,
  keyword: string,
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

  const {
    isFetched,
    error,
    data: tokens,
  } = useQuery<Token[], Error>({
    queryKey: ["tokens", tokenType, page, keyword],
    queryFn: () => fetchTokens(tokenType, page, keyword),
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

  return (
    <TokenList
      tokens={tokens ?? []}
      isFetched={isFetched}
      error={error}
      tokenType={tokenType}
      changeTokenType={changeTokenType}
      search={search}
      keyword={keyword}
      currentPage={page}
      totalPage={100}
      movePage={movePage}
    />
  );
};

export default TokenListContainer;
