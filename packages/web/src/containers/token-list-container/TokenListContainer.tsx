import React, { useCallback, useState, useEffect, useMemo } from "react";
import TokenList from "@components/home/token-list/TokenList";
import {
  MATH_NEGATIVE_TYPE,
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { type TokenInfo } from "@models/token/token-info";
import { type TokenPairInfo } from "@models/token/token-pair-info";
import { ValuesType } from "utility-types";
import { useWindowSize } from "@hooks/common/use-window-size";
import useClickOutside from "@hooks/common/use-click-outside";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { checkPositivePrice } from "@utils/common";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { toPriceFormat } from "@utils/number-utils";
import { useLoading } from "@hooks/common/use-loading";
import { MAIN_TOKEN_LIST_SIZE } from "@constants/table.constant";

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
}

export interface SortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
  firstActive?: boolean;
}

export const TABLE_HEAD = {
  INDEX: "#",
  NAME: "Name",
  PRICE: "Price",
  PRICE_OF_1D: "1d",
  PRICE_OF_7D: "7d",
  PRICE_OF_30D: "30d",
  MARKET_CAP: "Market Cap",
  LIQUIDITY: "TVL",
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
    idx: 1,
    graphStatus: MATH_NEGATIVE_TYPE.POSITIVE,
    isNative: false,
  },
];

const TokenListContainer: React.FC = () => {
  const [tokenType, setTokenType] = useState<TOKEN_TYPE>(TOKEN_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
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

  const { tokens, error, tokenPrices } = useTokenData();

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
        firstActive: false,
      });
    },
    [sortOption],
  );

  const firstData = useMemo(() => {
    const grc20 = tokenType === TOKEN_TYPE.GRC20 ? "gno.land/r/" : "";

    let temp = tokens
      // let temp = (tokens?.[0] ? [tokens?.[0]] : [])
      .filter((token: TokenModel) => token.path !== wugnotPath)
      .map((item: TokenModel) => {
        const isGnot = item.path === "gnot";
        const tempTokenPrice: TokenPriceModel =
          tokenPrices[isGnot ? wugnotPath : item.path] ?? {};
        const tempWuGnot: TokenPriceModel = tokenPrices[wugnotPath] ?? {};
        const transferData = isGnot ? tempWuGnot : tempTokenPrice;
        const splitMostLiquidity: string[] =
          tempTokenPrice?.mostLiquidityPool?.split(":") || [];
        const swapFeeType: SwapFeeTierType =
          `FEE_${splitMostLiquidity[2]}` as SwapFeeTierType;
        const tempTokenA = tokens.filter(
          (_item: TokenModel) => _item.path === splitMostLiquidity[0],
        );
        const tempTokenB = tokens.filter(
          (_item: TokenModel) => _item.path === splitMostLiquidity[1],
        );

        const dataToday = checkPositivePrice(
          transferData.pricesBefore?.latestPrice,
          transferData.pricesBefore?.priceToday,
        );

        const data7day = checkPositivePrice(
          transferData.pricesBefore?.latestPrice,
          transferData.pricesBefore?.price7d,
        );
        const graphStatus = checkPositivePrice(
          transferData.pricesBefore?.latestPrice,
          tempTokenPrice.last7d?.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )?.[0].price,
        ).status;

        const data30D = checkPositivePrice(
          transferData.pricesBefore?.latestPrice,
          transferData.pricesBefore?.price30d,
        );

        return {
          ...transferData,
          token: {
            path: item.path,
            name: item.name,
            symbol: item.symbol,
            logoURI: item.logoURI,
          },
          mostLiquidPool: tempTokenPrice?.mostLiquidityPool ? {
            poolId: Math.floor(Math.random() * 50 + 1).toString(),
            tokenPair: {
              tokenA: {
                path: !tempTokenA ? "" : tempTokenA?.[0]?.path,
                name: getGnotPath(tempTokenA?.[0]).name,
                symbol: getGnotPath(tempTokenA?.[0]).symbol,
                logoURI: getGnotPath(tempTokenA?.[0]).logoURI,
              },
              tokenB: {
                path: !tempTokenB ? "" : tempTokenB?.[0]?.path,
                name: getGnotPath(tempTokenB?.[0]).name,
                symbol: getGnotPath(tempTokenB?.[0]).symbol,
                logoURI: getGnotPath(tempTokenB?.[0]).logoURI,
              },
            },
            feeRate:
              splitMostLiquidity.length > 1
                ? `${SwapFeeTierInfoMap[swapFeeType].rateStr}`
                : "0.02%",
          } : undefined,
          last7days: [
            ...(transferData?.last7d
              ?.sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )
              .map(item => Number(item.price || 0)) || []),
            ...transferData?.pricesBefore?.latestPrice
              ? [Number(transferData?.pricesBefore?.latestPrice)]
              : [],
          ],
          marketCap: `$${Math.floor(
            Number(
              (isGnot
                ? 1000000000 * Number(transferData.usd)
                : transferData.marketCap) || 0,
            ),
          ).toLocaleString()}`,
          liquidity: `$${Math.floor(
            Number(transferData.lockedTokensUsd || 0),
          ).toLocaleString()}`,
          volume24h: `$${Math.floor(
            Number(transferData.volumeUsd24h || 0),
          ).toLocaleString()}`,
          price: transferData.usd ? toPriceFormat(
            transferData.usd, {
            usd: true,
            isRounding: false,
            fixedLessThan1Significant: 3,
          }) : "--",
          priceOf1d: {
            status: dataToday.status,
            value:
              dataToday.percentDisplay !== "-"
                ? dataToday.percentDisplay.replace(/[+-]/g, "")
                : dataToday.percentDisplay,
            realValue:
              dataToday.percentDisplay === "-"
                ? -100000000000
                : Number(dataToday.percentDisplay.replace(/[%]/g, "")),
          },
          priceOf7d: {
            status: data7day.status,
            value:
              data7day.percentDisplay !== "-"
                ? data7day.percentDisplay.replace(/[+-]/g, "")
                : data7day.percentDisplay,
            realValue:
              data7day.percentDisplay === "-"
                ? -100000000000
                : Number(data7day.percentDisplay.replace(/[%]/g, "")),
          },
          priceOf30d: {
            status: data30D.status,
            value:
              data30D.percentDisplay !== "-"
                ? data30D.percentDisplay.replace(/[+-]/g, "")
                : data30D.percentDisplay,
            realValue:
              data30D.percentDisplay === "-"
                ? -100000000000
                : Number(data30D.percentDisplay.replace(/[%]/g, "")),
          },
          idx: 1,
          graphStatus,
          isNative: isNativeToken(item),
        };
      });


    temp.sort((a: Token, b: Token) => {
      const volumeCompare = Number(b.volume24h.replace(/,/g, "").slice(1)) - Number(a.volume24h.replace(/,/g, "").slice(1));
      const marketCapCompare = Number(b.marketCap.replace(/,/g, "").slice(1)) - Number(a.marketCap.replace(/,/g, "").slice(1));
      const liquidityCompare = Number(b.liquidity.replace(/,/g, "").slice(1)) - Number(a.liquidity.replace(/,/g, "").slice(1));
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
    temp = temp.filter((item: Token) => ((item.token.path.includes(grc20))));
    return temp.map((item: Token, i: number) => ({ ...item, idx: i }));
  }, [tokenType, tokens, wugnotPath, tokenPrices]);

  const sortedData = useMemo(() => {
    const grc20 = tokenType === TOKEN_TYPE.GRC20 ? "gno.land/r/" : "";
    const temp = firstData.filter((item: Token) =>
      item.token.path.includes(grc20),
    );
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
          temp.sort((a: Token, b: Token) =>
            b.token.name.localeCompare(a.token.name),
          );
        } else {
          temp.sort((a: Token, b: Token) =>
            a.token.name.localeCompare(b.token.name),
          );
        }
      } else if (sortOption.key === TABLE_HEAD.PRICE) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: Token, b: Token) =>
              Number(a.price.slice(1)) - Number(b.price.slice(1)),
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -Number(a.price.slice(1)) + Number(b.price.slice(1)),
          );
        }
      } else if (sortOption.key === TABLE_HEAD.PRICE_OF_1D) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: Token, b: Token) =>
              a.priceOf1d.realValue - b.priceOf1d.realValue,
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -a.priceOf1d.realValue + b.priceOf1d.realValue,
          );
        }
      } else if (sortOption.key === TABLE_HEAD.PRICE_OF_30D) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: Token, b: Token) =>
              a.priceOf30d.realValue - b.priceOf30d.realValue,
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -a.priceOf30d.realValue + b.priceOf30d.realValue,
          );
        }
      } else if (sortOption.key === TABLE_HEAD.PRICE_OF_7D) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: Token, b: Token) =>
              a.priceOf7d.realValue - b.priceOf7d.realValue,
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -a.priceOf7d.realValue + b.priceOf7d.realValue,
          );
        }
      } else if (sortOption.key === TABLE_HEAD.MARKET_CAP) {
        if (sortOption.direction === "asc") {
          temp.sort((a: Token, b: Token) => Number(a.marketCap.replace(/,/g, "").slice(1)) - Number(b.marketCap.replace(/,/g, "").slice(1)));
        } else {
          temp.sort((a: Token, b: Token) => - Number(a.marketCap.replace(/,/g, "").slice(1)) + Number(b.marketCap.replace(/,/g, "").slice(1)));
        }
      } else if (sortOption.key === TABLE_HEAD.VOLUME) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: Token, b: Token) =>
              Number(a.volume24h.replace(/,/g, "").slice(1)) -
              Number(b.volume24h.replace(/,/g, "").slice(1)),
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -Number(a.volume24h.replace(/,/g, "").slice(1)) +
              Number(b.volume24h.replace(/,/g, "").slice(1)),
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
              Number(a.liquidity.replace(/,/g, "").slice(1)) -
              Number(b.liquidity.replace(/,/g, "").slice(1)),
          );
        } else {
          temp.sort(
            (a: Token, b: Token) =>
              -Number(a.liquidity.replace(/,/g, "").slice(1)) +
              Number(b.liquidity.replace(/,/g, "").slice(1)),
          );
        }
      } else {
        temp
          .sort((a: Token, b: Token) => - Number(a.volume24h.replace(/,/g, "").slice(1)) + Number(b.volume24h.replace(/,/g, "").slice(1)));
      }
    }
    return temp.slice(
      page * MAIN_TOKEN_LIST_SIZE,
      (page + 1) * MAIN_TOKEN_LIST_SIZE,
    );
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
      totalPage={Math.ceil((tokens || []).length / MAIN_TOKEN_LIST_SIZE)}
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
