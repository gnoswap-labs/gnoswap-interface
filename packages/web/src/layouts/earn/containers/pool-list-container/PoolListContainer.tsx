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
import { PoolSortOption, POOL_TYPE, TABLE_HEAD, SortDirection } from "../../components/pool-list/types";

const PoolListContainer: React.FC = () => {
  const [poolType, setPoolType] = useState<POOL_TYPE>(POOL_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortOption, setTokenSortOption] = useState<PoolSortOption>({
    key: TABLE_HEAD.TVL,
    direction: SortDirection.DESC,
  });
  const [searchIcon, setSearchIcon] = useState(false);
  const [breakpoint] = useAtom(CommonState.breakpoint);
  const router = useCustomRouter();
  const { poolListInfos, updatePools } = usePoolData();
  const [componentRef, isClickOutside, setIsInside] = useClickOutside();
  const { isLoadingPools } = useLoading();
  const { tokenPrices } = useTokenData();

  const themeKey = useAtomValue(ThemeState.themeKey);

  /**
   * Checks if either token has missing price information
   */
  const anyEmptyPrice = useCallback(
    (tokenA: TokenModel, tokenB: TokenModel) =>
      !tokenPrices?.[checkGnotPath(tokenA.priceID)]?.usd || !tokenPrices?.[checkGnotPath(tokenB.priceID)]?.usd,
    [tokenPrices],
  );

  /**
   * Fetch pool data on component mount
   */
  useEffect(() => {
    updatePools();
  }, []);

  /**
   * Hide search icon when clicking outside and no keyword is entered
   */
  useEffect(() => {
    if (!keyword && isClickOutside) {
      setSearchIcon(false);
    }
  }, [isClickOutside, keyword]);

  /**
   * Reset page to first page when filter criteria change
   */
  useEffect(() => {
    setPage(0);
  }, [keyword, poolType]);

  /**
   * Format pool value with proper formatting or fallback to "-" when price data is missing
   */
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

  /**
   * Check if pool info matches the search keyword
   */
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

  /**
   * Transform string values to numbers for sorting
   */
  const sortValueTransform = (value: string): number => {
    if (!value || value === "-") return -Infinity;

    const numericValue = value.replace(/[$,]/g, "");
    const number = Number(numericValue);

    return isNaN(number) ? -Infinity : number;
  };

  /**
   * Create sort function based on column and direction
   */
  const getSortFunction = useCallback((key: TABLE_HEAD, direction: SortDirection) => {
    return (a: PoolListInfo, b: PoolListInfo) => {
      const multiplier = direction === SortDirection.ASC ? 1 : -1;

      switch (key) {
        case TABLE_HEAD.POOL_NAME:
          return multiplier * a.tokenA.name.localeCompare(b.tokenA.name);
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

  /**
   * Filter pools based on pool type
   */
  const filteredPoolType = useCallback((poolType: POOL_TYPE, incentivized: boolean) => {
    switch (poolType) {
      case POOL_TYPE.INCENTIVIZED:
        return incentivized;
      case POOL_TYPE.NONE_INCENTIVIZED:
        return !incentivized;
      default:
        return true;
    }
  }, []);

  /**
   * Filter and format pool data based on search keyword and pool type
   */
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

  /**
   * Sort filtered pools based on current sort option
   */
  const sortedPools = useMemo(() => {
    if (!sortOption) {
      return [...filteredPools].sort((a, b) => -sortValueTransform(a.tvl) + sortValueTransform(b.tvl));
    }

    return [...filteredPools].sort(getSortFunction(sortOption?.key || TABLE_HEAD.TVL, sortOption?.direction || "desc"));
  }, [filteredPools, sortOption, getSortFunction]);

  /**
   * Calculate total number of pages
   */
  const totalPage = useMemo(() => {
    return Math.ceil(sortedPools.length / EARN_POOL_LIST_SIZE);
  }, [sortedPools.length]);

  /**
   * Navigate to pool detail page
   */
  const routeItem = (id: string) => {
    router.movePageWithPoolPath("POOL", id);
  };

  /**
   * Toggle search icon visibility
   */
  const onTogleSearch = () => {
    setSearchIcon(prev => !prev);
    setIsInside(true);
  };

  /**
   * Change current pool type filter
   */
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

  /**
   * Update search keyword from input
   */
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  /**
   * Navigate to specific page
   */
  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  /**
   * Update sort option when column header is clicked
   */
  const handleSort = useCallback(
    (item: TABLE_HEAD) => {
      const key = item;
      const direction =
        sortOption?.key !== item
          ? SortDirection.DESC
          : sortOption.direction === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC;

      setTokenSortOption({
        key,
        direction,
      });
    },
    [sortOption],
  );

  /**
   * Check if column supports sorting
   */
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
      search={handleSearch}
      keyword={keyword}
      currentPage={page}
      totalPage={totalPage}
      movePage={movePage}
      sortOption={sortOption}
      sort={handleSort}
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
