import {
  type POOL_TYPE,
  type Pool,
} from "@containers/pool-list-container/PoolListContainer";
import React from "react";
import PoolListHeader from "@components/earn/pool-list-header/PoolListHeader";
import PoolListTable from "@components/earn/pool-list-table/PoolListTable";
import Pagination from "@components/common/pagination/Pagination";

interface TokenListProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  error: Error | null;
  poolType: POOL_TYPE;
  changePoolType: (newTokenType: POOL_TYPE) => void;
  search: (keyword: string) => void;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
}

const TokenList: React.FC<TokenListProps> = ({
  pools,
  isLoading,
  error,
  poolType,
  changePoolType,
  search,
  currentPage,
  totalPage,
  movePage,
}) => {
  return (
    <div>
      <PoolListHeader
        poolType={poolType}
        changePoolType={changePoolType}
        search={search}
      />
      <PoolListTable pools={pools} />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
      />
    </div>
  );
};

export default TokenList;
