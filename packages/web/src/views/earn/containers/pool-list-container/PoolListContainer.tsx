import { useAtom, useAtomValue } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { INCENTIVE_TYPE } from "@constants/option.constant";
import { EARN_POOL_LIST_SIZE } from "@constants/table.constant";
import useClickOutside from "@hooks/common/use-click-outside";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { TokenModel } from "@models/token/token-model";
import { CommonState, ThemeState } from "@states/index";
import { checkGnotPath } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";

import PoolList from "../../components/pool-list/PoolList";
import {
  PoolSortOption,
  POOL_TYPE,
  TABLE_HEAD,
} from "../../components/pool-list/types";

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
      !tokenPrices?.[checkGnotPath(tokenA.priceID)]?.usd ||
      !tokenPrices?.[checkGnotPath(tokenB.priceID)]?.usd,
    [tokenPrices],
  );

  useEffect(() => {
    updatePools();
  }, []);

  useEffect(() => {
    if (!keyword) {
      if (isClickOutside) {
        setSearchIcon(false);
      }
    }
  }, [isClickOutside, keyword]);

  const sortValueTransform = (value: string) => {
    if (!value) return -1;

    return Number(value);
  };

  const filteredPoolType = useCallback(
    (poolType: POOL_TYPE, incentivizedType: INCENTIVE_TYPE) => {
      switch (poolType) {
        case POOL_TYPE.INCENTIVIZED:
          return incentivizedType !== "NONE_INCENTIVIZED";
        case POOL_TYPE.NONE_INCENTIVIZED:
          return incentivizedType === "NONE_INCENTIVIZED";
        default:
          break;
      }
      return true;
    },
    [],
  );

  const sortedPoolListInfos = useMemo(() => {
    const temp = poolListInfos.filter(info => {
      if (keyword !== "") {
        return (
          info.tokenA.name.toLowerCase().includes(keyword.toLowerCase()) ||
          info.tokenB.name.toLowerCase().includes(keyword.toLowerCase()) ||
          info.tokenA.symbol.toLowerCase().includes(keyword.toLowerCase()) ||
          info.tokenB.symbol.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      return true;
    });
    if (sortOption) {
      if (sortOption.key === TABLE_HEAD.POOL_NAME) {
        if (sortOption.direction === "asc") {
          temp.sort((a: PoolListInfo, b: PoolListInfo) =>
            b.tokenA.name.localeCompare(a.tokenA.name),
          );
        } else {
          temp.sort((a: PoolListInfo, b: PoolListInfo) =>
            a.tokenA.name.localeCompare(b.tokenA.name),
          );
        }
      } else if (sortOption.key === TABLE_HEAD.TVL) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              sortValueTransform(a.tvl) - sortValueTransform(b.tvl),
          );
        } else {
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              -sortValueTransform(a.tvl) + sortValueTransform(b.tvl),
          );
        }
      } else if (sortOption.key === TABLE_HEAD.VOLUME) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              sortValueTransform(a.volume24h) - sortValueTransform(b.volume24h),
          );
        } else {
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              -sortValueTransform(a.volume24h) +
              sortValueTransform(b.volume24h),
          );
        }
      } else if (sortOption.key === TABLE_HEAD.FEES) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              sortValueTransform(a.fees24h) - sortValueTransform(b.fees24h),
          );
        } else {
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              -sortValueTransform(a.fees24h) + sortValueTransform(b.fees24h),
          );
        }
      } else if (sortOption.key === TABLE_HEAD.APR) {
        if (sortOption.direction === "asc") {
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              sortValueTransform(a.apr) - sortValueTransform(b.apr),
          );
        } else {
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              -sortValueTransform(a.apr) + sortValueTransform(b.apr),
          );
        }
      }
    } else {
      temp.sort(
        (a: PoolListInfo, b: PoolListInfo) =>
          -sortValueTransform(a.tvl) + sortValueTransform(b.tvl),
      );
    }
    return temp
      .filter(info => filteredPoolType(poolType, info.incentiveType))
      .map(item => ({
        ...item,
        liquidity: !anyEmptyPrice(item.tokenA, item.tokenB)
          ? formatOtherPrice(item.liquidity || 0, {
              isKMB: false,
              decimals: 0,
            })
          : "-",
        volume24h: !anyEmptyPrice(item.tokenA, item.tokenB)
          ? formatOtherPrice(item.volume24h || 0, {
              isKMB: false,
              decimals: 0,
            })
          : "-",
        fees24h: !anyEmptyPrice(item.tokenA, item.tokenB)
          ? formatOtherPrice(item.fees24h || 0, {
              isKMB: false,
              decimals: 0,
            })
          : "-",
        tvl: !anyEmptyPrice(item.tokenA, item.tokenB)
          ? formatOtherPrice(item.tvl || 0, {
              isKMB: false,
              decimals: 0,
            })
          : "-",
        apr: !anyEmptyPrice(item.tokenA, item.tokenB) ? item.apr : "",
      }));
  }, [
    poolListInfos,
    sortOption,
    keyword,
    filteredPoolType,
    poolType,
    anyEmptyPrice,
  ]);

  const totalPage = useMemo(() => {
    return Math.ceil(sortedPoolListInfos.length / EARN_POOL_LIST_SIZE);
  }, [sortedPoolListInfos.length]);

  const routeItem = (id: string) => {
    router.movePageWithPoolPath("POOL", id);
  };
  const onTogleSearch = () => {
    setSearchIcon(prev => !prev);
    setIsInside(true);
  };
  const changePoolType = useCallback((newType: string) => {
    setPage(0);

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
    setPage(0);
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
    const disableItems = [
      "Earn:poolList.col.incentive",
      "Earn:poolList.col.liquidityPlot",
    ];
    return !disableItems.includes(head);
  }, []);

  return (
    <PoolList
      pools={sortedPoolListInfos.slice(
        page * EARN_POOL_LIST_SIZE,
        (page + 1) * EARN_POOL_LIST_SIZE,
      )}
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
