import React from "react";

import Pagination from "@components/common/pagination/Pagination";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { DEVICE_TYPE } from "@styles/media";

import PoolListHeader from "./pool-list-header/PoolListHeader";
import PoolListTable from "./pool-list-table/PoolListTable";
import { PoolSortOption, POOL_TYPE, TABLE_HEAD } from "./types";

import { PoolListWrapper } from "./PoolList.styles";

interface TokenListProps {
  pools: PoolListInfo[];
  isFetched: boolean;
  poolType?: POOL_TYPE;
  changePoolType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
  sort: (item: TABLE_HEAD) => void;
  sortOption: PoolSortOption | undefined;
  isSortOption: (item: TABLE_HEAD) => boolean;
  searchIcon: boolean;
  onTogleSearch: () => void;
  breakpoint: DEVICE_TYPE;
  routeItem: (id: string) => void;
  searchRef: React.RefObject<HTMLDivElement>;
  themeKey: "dark" | "light";
}

const PoolList: React.FC<TokenListProps> = ({
  pools,
  isFetched,
  poolType = POOL_TYPE.ALL,
  changePoolType,
  search,
  keyword,
  currentPage,
  totalPage,
  movePage,
  sort,
  sortOption,
  isSortOption,
  searchIcon,
  onTogleSearch,
  breakpoint,
  routeItem,
  searchRef,
  themeKey,
}) => {
  return (
    <PoolListWrapper>
      <PoolListHeader
        poolType={poolType}
        changePoolType={changePoolType}
        search={search}
        keyword={keyword}
        breakpoint={breakpoint}
        searchIcon={searchIcon}
        onTogleSearch={onTogleSearch}
        searchRef={searchRef}
      />
      <PoolListTable
        pools={pools}
        isFetched={isFetched}
        sort={sort}
        sortOption={sortOption}
        isSortOption={isSortOption}
        routeItem={routeItem}
        themeKey={themeKey}
        breakpoint={breakpoint}
      />
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={movePage}
          siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
        />
      )}
    </PoolListWrapper>
  );
};

export default PoolList;
