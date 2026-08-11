import TokenList from "@components/home/token-list/TokenList";
import { MATH_NEGATIVE_TYPE, SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { MAIN_TOKEN_LIST_SIZE } from "@constants/table.constant";
import useClickOutside from "@hooks/common/use-click-outside";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { type TokenInfo } from "@models/token/token-info";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { type TokenPairInfo } from "@models/token/token-pair-info";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import { TokenPriceModel } from "@models/token/token-price-model";
import { useGetTokens } from "@query/token";
import { checkPositivePrice } from "@utils/common";
import { formatOtherPrice, formatPrice } from "@utils/new-number-utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ValuesType } from "utility-types";
import { getLast7dGraphStatus } from "./token-list-graph-status";

interface NegativeStatusType {
  status: MATH_NEGATIVE_TYPE;
  value: string;
  realValue: number;
}
export interface MostLiquidPool {
  poolId: string;
  tokenPair: TokenPairInfo;
  feeRate: string;
}

export interface Token {
  path: string;
  token: TokenInfo;
  price: string;
  priceOf1d: NegativeStatusType;
  priceOf7d: NegativeStatusType;
  priceOf30d: NegativeStatusType;
  marketCap: string;
  liquidity: string;
  volume24h: string;
  mostLiquidPool?: MostLiquidPool;
  last7days: number[];
  idx: number;
  graphStatus: MATH_NEGATIVE_TYPE;
  isNative: boolean;
  priceGradeType: TOKEN_PRICE_GRADE_TYPE;
}

export interface SortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
  firstActive?: boolean;
}

export const TABLE_HEAD = {
  INDEX: "#",
  NAME: "Main:tokenList.header.nameCol",
  PRICE: "Main:tokenList.header.priceCol",
  PRICE_OF_1D: "1d",
  PRICE_OF_7D: "7d",
  PRICE_OF_30D: "30d",
  MARKET_CAP: "Main:tokenList.header.marketCapCol",
  LIQUIDITY: "TVL",
  VOLUME: "Main:tokenList.header.volumeCol",
  MOST_LIQUID_POOL: "Main:tokenList.header.mostLiquidCol",
  LAST_7_DAYS: "Main:tokenList.header.last7daysCol",
} as const;

export const TABLE_HEAD_MOBILE = {
  NAME: "Main:tokenList.header.nameCol",
  PRICE: "Main:tokenList.header.priceCol",
} as const;

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const TOKEN_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;
export type TOKEN_TYPE = ValuesType<typeof TOKEN_TYPE>;

export const createDummyTokenList = (): Token[] => [
  {
    priceGradeType: "ORACLE",
    path: Math.floor(Math.random() * 50 + 1).toString(),
    token: {
      path: "1",
      name: "Bitcoin",
      symbol: "BTC",
      displaySymbol: "BTC",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "12.08%",
      realValue: 0,
    },
    priceOf7d: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "19.92%",
      realValue: 0,
    },
    priceOf30d: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "19.12%",
      realValue: 0,
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
          displaySymbol: "HEX",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
        },
        tokenB: {
          path: Math.floor(Math.random() * 50 + 1).toString(),
          name: "USDCoin",
          symbol: "USDC",
          displaySymbol: "USDC",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        },
      },
      feeRate: "0.05%",
    },
    last7days: Array.from({ length: 40 }, () => Math.round(Math.random() * 100)),
    idx: 1,
    graphStatus: MATH_NEGATIVE_TYPE.POSITIVE,
    isNative: false,
  },
];

const TokenListContainer: React.FC = () => {
  const [tokenType, setTokenType] = useState<TOKEN_TYPE>(TOKEN_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [showUnverifiedTokens, setShowUnverifiedTokens] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({
    key: TABLE_HEAD.VOLUME,
    direction: "desc",
    firstActive: false,
  });
  const { breakpoint } = useWindowSize();
  const [searchIcon, setSearchIcon] = useState(false);
  const [componentRef, isClickOutside, setIsInside] = useClickOutside();
  const { wugnotPath, getGnotPath } = useGnotToGnot();
  const { isLoadingTokens } = useLoading();

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

  const { error, tokenPrices } = useTokenData(showUnverifiedTokens);
  const { data: { tokens = [] } = {} } = useGetTokens(showUnverifiedTokens);

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

  const toggleShowUnverifiedTokens = useCallback(() => {
    setShowUnverifiedTokens(prev => !prev);
    setPage(0);
  }, []);

  const isSortOption = useCallback((head: TABLE_HEAD) => {
    const disableItems = [TABLE_HEAD.MOST_LIQUID_POOL.toString(), TABLE_HEAD.LAST_7_DAYS.toString()];

    return !disableItems.includes(head);
  }, []);

  const sort = useCallback(
    (item: TABLE_HEAD) => {
      const key = item;
      const direction = sortOption?.key !== item ? "desc" : sortOption.direction === "asc" ? "desc" : "asc";

      setSortOption({
        key,
        direction,
        firstActive: false,
      });
    },
    [sortOption],
  );

  const firstData = useMemo(() => {
    const grc20 = tokenType === TOKEN_TYPE.GRC20 ? "gno.land/r/" : "";

    let temp = tokens.filter((token: TokenModel) => token.path !== wugnotPath).map((item: TokenModel) => {
      const isGnot = item.path === "ugnot";
      const priceDataPath = isGnot ? wugnotPath : item.path;
      const selectedPriceData: TokenPriceModel = tokenPrices[priceDataPath] ?? {};
      const gnotPriceData = tokenPrices.ugnot;
      const rowMarketCap = isGnot ? gnotPriceData?.marketCap : selectedPriceData.marketCap;
      const splitMostLiquidity: string[] = selectedPriceData.mostLiquidityPool?.split(":") || [];
      const swapFeeType: SwapFeeTierType = `FEE_${splitMostLiquidity[2]}` as SwapFeeTierType;
      const tempTokenA = tokens.filter((_item: TokenModel) => _item.path === splitMostLiquidity[0]);
      const tempTokenB = tokens.filter((_item: TokenModel) => _item.path === splitMostLiquidity[1]);

      const data1day = checkPositivePrice(
        selectedPriceData.pricesBefore?.latestPrice,
        selectedPriceData.pricesBefore?.price1d,
      );

      const data7day = checkPositivePrice(
        selectedPriceData.pricesBefore?.latestPrice,
        selectedPriceData.pricesBefore?.price7d,
      );
      const last7days = [
        ...[...(selectedPriceData.last7d || [])]
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
          .map(item => Number(item.price || 0)),
        ...(selectedPriceData.pricesBefore?.latestPrice ? [Number(selectedPriceData.pricesBefore.latestPrice)] : []),
      ];
      const graphStatus = getLast7dGraphStatus(last7days);

      const data30D = checkPositivePrice(
        selectedPriceData.pricesBefore?.latestPrice,
        selectedPriceData.pricesBefore?.price30d,
      );

      return {
        ...selectedPriceData,
        priceGradeType: selectedPriceData.priceGradeType,
        token: {
          path: item.path,
          name: item.name,
          symbol: item.symbol,
          displaySymbol: item.displaySymbol,
          logoURI: item.logoURI,
        },
        mostLiquidPool: selectedPriceData.mostLiquidityPool
          ? {
              poolId: Math.floor(Math.random() * 50 + 1).toString(),
              tokenPair: {
                tokenA: {
                  path: !tempTokenA ? "" : tempTokenA?.[0]?.path,
                  name: getGnotPath(tempTokenA?.[0]).name,
                  symbol: getGnotPath(tempTokenA?.[0]).symbol,
                  displaySymbol: getGnotPath(tempTokenA?.[0]).displaySymbol,
                  logoURI: getGnotPath(tempTokenA?.[0]).logoURI,
                },
                tokenB: {
                  path: !tempTokenB ? "" : tempTokenB?.[0]?.path,
                  name: getGnotPath(tempTokenB?.[0]).name,
                  symbol: getGnotPath(tempTokenB?.[0]).symbol,
                  displaySymbol: getGnotPath(tempTokenB?.[0]).displaySymbol,
                  logoURI: getGnotPath(tempTokenB?.[0]).logoURI,
                },
              },
              feeRate: splitMostLiquidity.length > 1 ? `${SwapFeeTierInfoMap[swapFeeType].rateStr}` : "0.02%",
            }
          : undefined,
        last7days,
        marketCap: rowMarketCap ? `$${Math.floor(Number(rowMarketCap || 0)).toLocaleString()}` : "-",
        liquidity: formatOtherPrice(selectedPriceData.lockedTokensUsd, {
          decimals: 0,
          isKMB: false,
        }),
        volume24h: formatOtherPrice(selectedPriceData.volumeUsd24h, {
          decimals: 0,
          isKMB: false,
        }),
        price: selectedPriceData.usd
          ? formatPrice(selectedPriceData.usd, { isKMB: false, forcedDecimals: true })
          : "--",
        priceOf1d: {
          status: data1day.status,
          value:
            data1day.percentDisplay !== "-" ? data1day.percentDisplay.replace(/[+-]/g, "") : data1day.percentDisplay,
          realValue:
            data1day.percentDisplay === "-" ? -100000000000 : Number(data1day.percentDisplay.replace(/[%]/g, "")),
        },
        priceOf7d: {
          status: data7day.status,
          value:
            data7day.percentDisplay !== "-" ? data7day.percentDisplay.replace(/[+-]/g, "") : data7day.percentDisplay,
          realValue:
            data7day.percentDisplay === "-" ? -100000000000 : Number(data7day.percentDisplay.replace(/[%]/g, "")),
        },
        priceOf30d: {
          status: data30D.status,
          value: data30D.percentDisplay !== "-" ? data30D.percentDisplay.replace(/[+-]/g, "") : data30D.percentDisplay,
          realValue:
            data30D.percentDisplay === "-" ? -100000000000 : Number(data30D.percentDisplay.replace(/[%]/g, "")),
        },
        idx: 1,
        graphStatus,
        isNative: isNativeToken(item),
      };
    });

    temp.sort((a: Token, b: Token) => {
      const volumeCompare =
        Number(b.volume24h.replace(/,/g, "").slice(1)) - Number(a.volume24h.replace(/,/g, "").slice(1));
      const marketCapCompare =
        Number(b.marketCap.replace(/,/g, "").slice(1)) - Number(a.marketCap.replace(/,/g, "").slice(1));
      const liquidityCompare =
        Number(b.liquidity.replace(/,/g, "").slice(1)) - Number(a.liquidity.replace(/,/g, "").slice(1));
      const alphabeticalCompare = a.token.name.localeCompare(b.token.name);

      if (volumeCompare !== 0) {
        return volumeCompare;
      } else if (marketCapCompare !== 0) {
        return marketCapCompare;
      } else if (liquidityCompare !== 0) {
        return liquidityCompare;
      } else {
        return alphabeticalCompare;
      }
    });
    temp = temp.filter((item: Token) => item.token.path.includes(grc20));
    return temp.map((item: Token, i: number) => ({ ...item, idx: i }));
  }, [getGnotPath, showUnverifiedTokens, tokenType, tokens, wugnotPath, tokenPrices]);

  const sortedData = useMemo(() => {
    const grc20 = tokenType === TOKEN_TYPE.GRC20 ? "gno.land/r/" : "";
    const temp = firstData.filter((item: Token) => item.token.path.includes(grc20));
    if (keyword) {
      return temp.filter(
        (item: Token) =>
          item.token.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.token.symbol.toLowerCase().includes(keyword.toLowerCase()),
      );
    }
    if (sortOption) {
      if (sortOption.key === TABLE_HEAD.NAME) {
        if (sortOption.direction === "asc") {
          temp.sort((a: Token, b: Token) => b.token.name.localeCompare(a.token.name));
        } else {
          temp.sort((a: Token, b: Token) => a.token.name.localeCompare(b.token.name));
        }
      } else if (sortOption.key === TABLE_HEAD.PRICE) {
        if (sortOption.direction === "asc") {
          temp.sort((a: Token, b: Token) => Number(a.price.slice(1)) - Number(b.price.slice(1)));
        } else {
          temp.sort((a: Token, b: Token) => -Number(a.price.slice(1)) + Number(b.price.slice(1)));
        }
      } else if (sortOption.key === TABLE_HEAD.PRICE_OF_1D) {
        if (sortOption.direction === "asc") {
          temp.sort((a: Token, b: Token) => a.priceOf1d.realValue - b.priceOf1d.realValue);
        } else {
          temp.sort((a: Token, b: Token) => -a.priceOf1d.realValue + b.priceOf1d.realValue);
        }
      } else if (sortOption.key === TABLE_HEAD.PRICE_OF_30D) {
        if (sortOption.direction === "asc") {
          temp.sort((a: Token, b: Token) => a.priceOf30d.realValue - b.priceOf30d.realValue);
        } else {
          temp.sort((a: Token, b: Token) => -a.priceOf30d.realValue + b.priceOf30d.realValue);
        }
      } else if (sortOption.key === TABLE_HEAD.PRICE_OF_7D) {
        if (sortOption.direction === "asc") {
          temp.sort((a: Token, b: Token) => a.priceOf7d.realValue - b.priceOf7d.realValue);
        } else {
          temp.sort((a: Token, b: Token) => -a.priceOf7d.realValue + b.priceOf7d.realValue);
        }
      } else if (sortOption.key === TABLE_HEAD.MARKET_CAP) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: Token, b: Token) =>
              Number(a.marketCap.replace(/,/g, "").slice(1)) - Number(b.marketCap.replace(/,/g, "").slice(1)),
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -Number(a.marketCap.replace(/,/g, "").slice(1)) + Number(b.marketCap.replace(/,/g, "").slice(1)),
          );
        }
      } else if (sortOption.key === TABLE_HEAD.VOLUME) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: Token, b: Token) =>
              Number(a.volume24h.replace(/,/g, "").slice(1)) - Number(b.volume24h.replace(/,/g, "").slice(1)),
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -Number(a.volume24h.replace(/,/g, "").slice(1)) + Number(b.volume24h.replace(/,/g, "").slice(1)),
          );
        }
      } else if (sortOption.key === TABLE_HEAD.INDEX) {
        if (sortOption.direction === "asc") {
          temp.sort((a: Token, b: Token) => a.idx - b.idx);
        } else {
          temp.sort((a: Token, b: Token) => -a.idx + b.idx);
        }
      } else if (sortOption.key === TABLE_HEAD.LIQUIDITY) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: Token, b: Token) =>
              Number(a.liquidity.replace(/,/g, "").slice(1)) - Number(b.liquidity.replace(/,/g, "").slice(1)),
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -Number(a.liquidity.replace(/,/g, "").slice(1)) + Number(b.liquidity.replace(/,/g, "").slice(1)),
          );
        }
      } else {
        temp.sort(
          (a: Token, b: Token) =>
            -Number(a.volume24h.replace(/,/g, "").slice(1)) + Number(b.volume24h.replace(/,/g, "").slice(1)),
        );
      }
    }
    return temp.slice(page * MAIN_TOKEN_LIST_SIZE, (page + 1) * MAIN_TOKEN_LIST_SIZE);
  }, [keyword, tokenType, sortOption, firstData, page]);

  return (
    <TokenList
      tokens={sortedData}
      isFetched={!isLoadingTokens}
      error={error}
      tokenType={tokenType}
      sortOption={sortOption}
      changeTokenType={changeTokenType}
      search={search}
      keyword={keyword}
      currentPage={page}
      totalPage={Math.ceil(firstData.length / MAIN_TOKEN_LIST_SIZE)}
      movePage={movePage}
      isSortOption={isSortOption}
      sort={sort}
      breakpoint={breakpoint}
      searchIcon={searchIcon}
      onTogleSearch={onTogleSearch}
      searchRef={componentRef}
      showUnverifiedTokens={showUnverifiedTokens}
      toggleShowUnverifiedTokens={toggleShowUnverifiedTokens}
    />
  );
};

export default TokenListContainer;
