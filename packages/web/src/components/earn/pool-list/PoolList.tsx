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
import { DeviceSize } from "@styles/media";

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
  windowSize: number;
  searchIcon: boolean;
  onTogleSearch: () => void;
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
  windowSize,
  searchIcon,
  onTogleSearch,
}) => {
  return (
    <PoolListWrapper>
      <PoolListHeader
        poolType={poolType}
        changePoolType={changePoolType}
        search={search}
        keyword={keyword}
        windowSize={windowSize}
        searchIcon={searchIcon}
        onTogleSearch={onTogleSearch}
      />
      <PoolListTable
        pools={pools}
        isFetched={isFetched}
        sort={sort}
        sortOption={sortOption}
        isSortOption={isSortOption}
        windowSize={windowSize}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
        siblingCount={windowSize > DeviceSize.mobile ? 2 : 1}
      />
    </PoolListWrapper>
  );
};

export default PoolList;
