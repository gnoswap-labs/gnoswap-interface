import { useAtom, useAtomValue } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { EARN_POOL_LIST_SIZE } from "@constants/table.constant";
import useClickOutside from "@hooks/common/use-click-outside";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { usePoolData } from "@hooks/pool/data/use-pool-data";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { TokenModel } from "@models/token/token-model";
import { CommonState, ThemeState } from "@states/index";
import { checkGnotPath } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";

import PoolList from "../../components/pool-list/PoolList";
import { PoolSortOption, POOL_TYPE, TABLE_HEAD } from "../../components/pool-list/types";

const PoolListContainer: React.FC = () => {
  const [poolType, setPoolType] = useState<POOL_TYPE>(POOL_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortOption, setTokenSortOption] = useState<PoolSortOption>({
    key: TABLE_HEAD.TVL,
    direction: "desc",
  });
  const [searchIcon, setSearchIcon] = useState(false);
  const [breakpoint] = useAtom(CommonState.breakpoint);
  const router = useCustomRouter();
  const { poolListInfos, updatePools } = usePoolData();
  const [componentRef, isClickOutside, setIsInside] = useClickOutside();
  const { isLoadingPools } = useLoading();
  const { tokenPrices } = useTokenData();

  const themeKey = useAtomValue(ThemeState.themeKey);

  const anyEmptyPrice = useCallback(
    (tokenA: TokenModel, tokenB: TokenModel) =>
      !tokenPrices?.[checkGnotPath(tokenA.priceID)]?.usd || !tokenPrices?.[checkGnotPath(tokenB.priceID)]?.usd,
    [tokenPrices],
  );

  useEffect(() => {
    updatePools();
  }, []);

  useEffect(() => {
    if (!keyword && isClickOutside) {
      setSearchIcon(false);
    }
  }, [isClickOutside, keyword]);

  useEffect(() => {
    setPage(0);
  }, [keyword, poolType]);

  const formatPoolValue = useCallback(
    (value: string | number | undefined, tokenA: TokenModel, tokenB: TokenModel) => {
      if (anyEmptyPrice(tokenA, tokenB)) return "-";

      return formatOtherPrice(value || 0, {
        isKMB: false,
        decimals: 0,
      });
    },
    [anyEmptyPrice],
  );

  const matchesKeyword = useCallback((info: PoolListInfo, keyword: string) => {
    if (!keyword) return true;

    const searchTerm = keyword.toLowerCase();
    return (
      info.tokenA.name.toLowerCase().includes(searchTerm) ||
      info.tokenB.name.toLowerCase().includes(searchTerm) ||
      info.tokenA.symbol.toLowerCase().includes(searchTerm) ||
      info.tokenB.symbol.toLowerCase().includes(searchTerm)
    );
  }, []);

  const sortValueTransform = (value: string) => {
    if (!value || value === "-") return -Infinity;

    const numericValue = value.replace(/[$,]/g, "");
    const number = Number(numericValue);

    return isNaN(number) ? -Infinity : number;
  };

  const getSortFunction = useCallback((key: TABLE_HEAD, direction: "asc" | "desc") => {
    return (a: PoolListInfo, b: PoolListInfo) => {
      const multiplier = direction === "asc" ? 1 : -1;

      switch (key) {
        case TABLE_HEAD.POOL_NAME:
          return (
            multiplier *
            (direction === "asc"
              ? b.tokenA.name.localeCompare(a.tokenA.name)
              : a.tokenA.name.localeCompare(b.tokenA.name))
          );
        case TABLE_HEAD.TVL:
          return multiplier * (sortValueTransform(a.tvl) - sortValueTransform(b.tvl));
        case TABLE_HEAD.VOLUME:
          return multiplier * (sortValueTransform(a.volume24h) - sortValueTransform(b.volume24h));
        case TABLE_HEAD.FEES:
          return multiplier * (sortValueTransform(a.fees24h) - sortValueTransform(b.fees24h));
        case TABLE_HEAD.APR:
          return multiplier * (sortValueTransform(a.apr) - sortValueTransform(b.apr));
        default:
          return -sortValueTransform(a.tvl) + sortValueTransform(b.tvl);
      }
    };
  }, []);

  const filteredPoolType = useCallback((poolType: POOL_TYPE, incentivized: boolean) => {
    if (poolType === POOL_TYPE.INCENTIVIZED) return incentivized === true;
    if (poolType === POOL_TYPE.NONE_INCENTIVIZED) return incentivized === false;
    return true;
  }, []);

  const filteredPools = useMemo(() => {
    return poolListInfos
      .filter(info => matchesKeyword(info, keyword))
      .filter(info => filteredPoolType(poolType, info.incentivized))
      .map(item => ({
        ...item,
        liquidity: formatPoolValue(item.liquidity, item.tokenA, item.tokenB),
        volume24h: formatPoolValue(item.volume24h, item.tokenA, item.tokenB),
        fees24h: formatPoolValue(item.fees24h, item.tokenA, item.tokenB),
        tvl: formatPoolValue(item.tvl, item.tokenA, item.tokenB),
        apr: anyEmptyPrice(item.tokenA, item.tokenB) ? "" : item.apr,
      }));
  }, [poolListInfos, keyword, poolType, anyEmptyPrice, matchesKeyword, filteredPoolType, formatPoolValue]);

  const sortedPools = useMemo(() => {
    const temp = [...filteredPools];
    if (!sortOption) {
      return temp.sort((a, b) => -sortValueTransform(a.tvl) + sortValueTransform(b.tvl));
    }

    temp.sort(getSortFunction(sortOption?.key || TABLE_HEAD.TVL, sortOption?.direction || "desc"));
    return temp;
  }, [filteredPools, sortOption, getSortFunction]);

  const totalPage = useMemo(() => {
    return Math.ceil(sortedPools.length / EARN_POOL_LIST_SIZE);
  }, [sortedPools.length]);

  const routeItem = (id: string) => {
    router.movePageWithPoolPath("POOL", id);
  };
  const onTogleSearch = () => {
    setSearchIcon(prev => !prev);
    setIsInside(true);
  };
  const changePoolType = useCallback((newType: string) => {
    switch (newType) {
      case POOL_TYPE.ALL:
        setPoolType(POOL_TYPE.ALL);
        break;
      case POOL_TYPE.INCENTIVIZED:
        setPoolType(POOL_TYPE.INCENTIVIZED);
        break;
      case POOL_TYPE.NONE_INCENTIVIZED:
        setPoolType(POOL_TYPE.NONE_INCENTIVIZED);
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
      const direction = sortOption?.key !== item ? "desc" : sortOption.direction === "asc" ? "desc" : "asc";

      setTokenSortOption({
        key,
        direction,
      });
    },
    [sortOption],
  );

  const isSortOption = useCallback((head: TABLE_HEAD) => {
    const disableItems = ["Earn:poolList.col.incentive", "Earn:poolList.col.liquidityPlot"];
    return !disableItems.includes(head);
  }, []);

  return (
    <PoolList
      pools={sortedPools.slice(page * EARN_POOL_LIST_SIZE, (page + 1) * EARN_POOL_LIST_SIZE)}
      isFetched={!isLoadingPools}
      poolType={poolType}
      changePoolType={changePoolType}
      search={search}
      keyword={keyword}
      currentPage={page}
      totalPage={totalPage}
      movePage={movePage}
      sortOption={sortOption}
      sort={sort}
      isSortOption={isSortOption}
      breakpoint={breakpoint}
      routeItem={routeItem}
      searchIcon={searchIcon}
      onTogleSearch={onTogleSearch}
      searchRef={componentRef}
      themeKey={themeKey}
    />
  );
};

export default PoolListContainer;
