import React, { useCallback, useState, useEffect } from "react";
import TokenList from "@components/home/token-list/TokenList";
import { MATH_NEGATIVE_TYPE, SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { type TokenInfo } from "@models/token/token-info";
import { type TokenPairInfo } from "@models/token/token-pair-info";
import { ValuesType } from "utility-types";
import { useWindowSize } from "@hooks/common/use-window-size";
import useClickOutside from "@hooks/common/use-click-outside";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { useGetTokenPrices, useGetTokensList } from "src/react-query/token";
interface NegativeStatusType {
  status: MATH_NEGATIVE_TYPE;
  value: string;
}
export interface MostLiquidPool {
  poolId: string;
  tokenPair: TokenPairInfo;
  feeRate: string;
}
export interface Token{
  path: string;
  token: TokenInfo;
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

export const TABLE_HEAD_MOBILE = {
  NAME: "Name",
  PRICE: "Price",
} as const;

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const TOKEN_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;
export type TOKEN_TYPE = ValuesType<typeof TOKEN_TYPE>;

const getStatus = (value: string) => {
  if (Number(value ?? 0) > 0) {
    return MATH_NEGATIVE_TYPE.POSITIVE;
  }
  
  return MATH_NEGATIVE_TYPE.NEGATIVE;
};

export const createDummyTokenList = (): Token[] => [
  {
    path: Math.floor(Math.random() * 50 + 1).toString(),
    token: {
      path: "1",
      name: "Bitcoin",
      symbol: "BTC",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
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
    },
    last7days: Array.from({ length: 40 }, () =>
      Math.round(Math.random() * 100),
    ),
  },
];

const TokenListContainer: React.FC = () => {
  const [tokenType, setTokenType] = useState<TOKEN_TYPE>(TOKEN_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>();
  const { breakpoint } = useWindowSize();
  const [searchIcon, setSearchIcon] = useState(false);
  const [componentRef, isClickOutside, setIsInside] = useClickOutside();

  useEffect(() => {
    if (!keyword) {
      if (isClickOutside) {
        setSearchIcon(false);
      }
    }
  }, [isClickOutside, keyword]);

  const onTogleSearch = () => {
    setSearchIcon(prev => !prev);
    setIsInside(true);
  };

  const { data: { tokens = [] } = {}, isFetched, error } = useGetTokensList();
  const { data: { prices = [] } = {} } = useGetTokenPrices();

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

  const sort = useCallback(
    (item: TABLE_HEAD) => {
      const key = item;
      const direction =
        sortOption?.key !== item
          ? "desc"
          : sortOption.direction === "asc"
            ? "desc"
            : "asc";

      setSortOption({
        key,
        direction,
      });
    },
    [sortOption],
  );

  const getDatas = useCallback(() => {
    const temp = tokens.map((item: TokenModel) => {
      const temp: TokenPriceModel = prices.filter((price: TokenPriceModel) => price.path === item.path)?.[0] ?? {};
      const splitMostLiquidity: string[] = temp?.mostLiquidityPool?.split(":") || [];
      const swapFeeType: SwapFeeTierType = `FEE_${splitMostLiquidity[2]}` as SwapFeeTierType;
      const tempToken = tokens.filter((_item: TokenModel) => _item.path === splitMostLiquidity[1]);
      return {
        ...temp,
        token: {
          path: item.path,
          name: item.name,
          symbol: item.symbol,
          logoURI: item.logoURI,
        },
        mostLiquidPool: {
          poolId: Math.floor(Math.random() * 50 + 1).toString(),
          tokenPair: {
            tokenA: {
              path: item.path,
              name: item.name,
              symbol: item.symbol,
              logoURI: item.logoURI,
            },
            tokenB: {
              path: Math.floor(Math.random() * 50 + 1).toString(),
              name: tempToken?.[0]?.name || "",
              symbol: tempToken?.[0]?.symbol || "",
              logoURI: tempToken?.[0]?.logoURI || "",
            },
          },
          feeRate: splitMostLiquidity.length > 1 ? `${SwapFeeTierInfoMap[swapFeeType].rateStr}` : "0.02%",
        },
        last7days: temp?.last7Days?.map(item => Number(item.price || 0)) || [],
        marketCap: `$${Math.floor(Number(temp.marketCap || 0)).toLocaleString()}`,
        liquidity: `$${Math.floor(Number(temp.liquidity || 0)).toLocaleString()}`,
        volume24h: `$${Math.floor(Number(temp.volume || 0)).toLocaleString()}`,
        price: `$${Number(temp.usd || 0).toLocaleString(undefined, { maximumFractionDigits: 10})}`,
        priceOf1d: { status: getStatus(temp.change1d), value: `${temp.change1d || 0}%` },
        priceOf7d: { status: getStatus(temp.change7d), value: `${temp.change7d || 0}%` },
        priceOf30d: { status: getStatus(temp.change30d), value: `${temp.change30d || 0}%` },
      };
    });
    if (keyword) {
      return temp.filter((item: Token) => (item.token.name.toLowerCase()).includes(keyword.toLowerCase()) || (item.token.symbol.toLowerCase()).includes(keyword.toLowerCase()));
    }
    return temp;
  }, [prices, tokens, keyword]);
  
  return (
    <TokenList
      tokens={getDatas()}
      isFetched={isFetched}
      error={error}
      tokenType={tokenType}
      sortOption={sortOption}
      changeTokenType={changeTokenType}
      search={search}
      keyword={keyword}
      currentPage={page}
      totalPage={Math.floor((tokens || []).length / 20 + 1)}
      movePage={movePage}
      isSortOption={isSortOption}
      sort={sort}
      breakpoint={breakpoint}
      searchIcon={searchIcon}
      onTogleSearch={onTogleSearch}
      searchRef={componentRef}
    />
  );
};

export default TokenListContainer;
