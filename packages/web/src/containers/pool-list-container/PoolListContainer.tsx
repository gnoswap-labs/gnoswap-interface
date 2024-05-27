import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type FeeOptions } from "@common/values/data-constant";
import PoolList from "@components/earn/pool-list/PoolList";
import { type TokenPairInfo } from "@models/token/token-pair-info";
import { ValuesType } from "utility-types";
import { useAtom, useAtomValue } from "jotai";
import { CommonState } from "@states/index";
import { useRouter } from "next/router";
import { usePoolData } from "@hooks/pool/use-pool-data";
import useClickOutside from "@hooks/common/use-click-outside";
import { ThemeState } from "@states/index";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { useLoading } from "@hooks/common/use-loading";
import { INCENTIVE_TYPE } from "@constants/option.constant";
import { EARN_POOL_LIST_SIZE } from "@constants/table.constant";

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
  TVL: "TVL",
  VOLUME: "Volume (24h)",
  FEES: "Fees (24h)",
  APR: "APR",
  REWARDS: "Incentive",
  LIQUIDITY_PLOT: "Liquidity Plot",
} as const;

export const SORT_SUPPORT_HEAD = [
  "Pool Name",
  "TVL",
  "Volume (24h)",
  "Fees (24h)",
  "APR",
];

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const POOL_TYPE = {
  ALL: "All",
  INCENTIVIZED: "Incentivized",
  NONE_INCENTIVIZED: "Non-Incentivized",
} as const;

export type POOL_TYPE = ValuesType<typeof POOL_TYPE>;

const PoolListContainer: React.FC = () => {
  const [poolType, setPoolType] = useState<POOL_TYPE>(POOL_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortOption, setTokenSortOption] = useState<PoolSortOption>();
  const [searchIcon, setSearchIcon] = useState(false);
  const [breakpoint] = useAtom(CommonState.breakpoint);
  const router = useRouter();
  const { poolListInfos, isFetchedPools, updatePools } = usePoolData();
  console.log("🚀 ~ poolListInfos:", poolListInfos);
  const [componentRef, isClickOutside, setIsInside] = useClickOutside();
  const { isLoadingCommon } = useLoading();

  const themeKey = useAtomValue(ThemeState.themeKey);

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

  // 10K -> 10000, 20M -> 2000000 ...
  const convertKMBtoNumber = (kmbValue: string) => {
    const sizesMap: { [key: string]: number } = {
      K: 1_000,
      M: 1_000_000,
      B: 1_000_000_000,
    };

    const lastChar = kmbValue.charAt(kmbValue.length - 1);
    let currentValue = Number(kmbValue.slice(0, kmbValue.length - 1));

    for (const sizeKey in sizesMap) {
      if (sizeKey === lastChar) {
        currentValue = sizesMap[sizeKey] * currentValue;
      }
    }

    return currentValue;
  };

  const sortValueTransform = (value: string) => {
    const formattedNumber = value.replace(/,/g, "").slice(1);
    const lastChar = formattedNumber.charAt(formattedNumber.length - 1);

    if (value === "<$0.01") {
      return 0.009;
    }

    if (["K", "M", "B"].some(item => item === lastChar)) {
      return convertKMBtoNumber(formattedNumber);
    }

    console.log("🚀 ~ sortValueTransform ~ value:", value);
    if (isNaN(Number(formattedNumber))) {
      return -1;
    }

    return Number(value.replace(/,/g, "").slice(1));
  };

  const sortedPoolListInfos = useMemo(() => {
    function filteredPoolType(
      poolType: POOL_TYPE,
      incentivizedType: INCENTIVE_TYPE,
    ) {
      switch (poolType) {
        case "Incentivized":
          return incentivizedType !== "NONE_INCENTIVIZED";
        case "Non-Incentivized":
          return incentivizedType === "NONE_INCENTIVIZED";
        default:
          break;
      }
      return true;
    }

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
          console.log("7239874982347 asc");
          temp.sort(
            (a: PoolListInfo, b: PoolListInfo) =>
              sortValueTransform(a.apr) - sortValueTransform(b.apr),
          );
        } else {
          console.log("7239874982347 dsc");
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
    return temp.filter(info => filteredPoolType(poolType, info.incentiveType));
  }, [keyword, poolListInfos, poolType, sortOption]);

  const totalPage = useMemo(() => {
    return Math.ceil(sortedPoolListInfos.length / EARN_POOL_LIST_SIZE);
  }, [sortedPoolListInfos.length]);

  const routeItem = (id: string) => {
    router.push(`/earn/pool/${id}`);
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
    const disableItems = ["Rewards", "Liquidity Plot"];
    return !disableItems.includes(head);
  }, []);

  return (
    <PoolList
      pools={sortedPoolListInfos.slice(
        page * EARN_POOL_LIST_SIZE,
        (page + 1) * EARN_POOL_LIST_SIZE,
      )}
      isFetched={isFetchedPools && !isLoadingCommon}
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
