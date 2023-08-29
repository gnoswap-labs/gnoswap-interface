// TODO : remove eslint-disable after work
/* eslint-disable */
import {
  Pool,
  POOL_TYPE,
  PoolSortOption,
  TABLE_HEAD,
} from "@containers/pool-list-container/PoolListContainer";
import React from "react";
import PoolListHeader from "@components/earn/pool-list-header/PoolListHeader";
import PoolListTable from "@components/earn/pool-list-table/PoolListTable";
import Pagination from "@components/common/pagination/Pagination";
import { PoolListWrapper } from "./PoolList.styles";
import { DeviceSize, DEVICE_TYPE } from "@styles/media";

interface TokenListProps {
  pools: Pool[];
  isFetched: boolean;
  error: Error | null;
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
  routeItem: (id: number) => void;
}

const PoolList: React.FC<TokenListProps> = ({
  pools,
  isFetched,
  error,
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
      />
      <PoolListTable
        pools={pools}
        isFetched={isFetched}
        sort={sort}
        sortOption={sortOption}
        isSortOption={isSortOption}
        routeItem={routeItem}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
        siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
      />
    </PoolListWrapper>
  );
};

export default PoolList;
