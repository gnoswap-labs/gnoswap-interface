import {
  Pool,
  TABLE_HEAD,
  type POOL_TYPE,
} from "@containers/pool-list-container/PoolListContainer";
import React from "react";
import PoolListHeader from "@components/earn/pool-list-header/PoolListHeader";
import PoolListTable from "@components/earn/pool-list-table/PoolListTable";
import Pagination from "@components/common/pagination/Pagination";
import { wrapper } from "./PoolList.styles";

interface TokenListProps {
  pools: Pool[];
  isFetched: boolean;
  error: Error | null;
  poolType: POOL_TYPE;
  changePoolType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
}

const PoolList: React.FC<TokenListProps> = ({
  pools,
  isFetched,
  error,
  poolType,
  changePoolType,
  search,
  keyword,
  currentPage,
  totalPage,
  movePage,
}) => {
  const onClickTableHead = (item: TABLE_HEAD) => {
    // TODO: Sorting pools list
  };
  return (
    <div css={wrapper}>
      <PoolListHeader
        poolType={poolType}
        changePoolType={changePoolType}
        search={search}
        keyword={keyword}
      />
      <PoolListTable
        pools={pools}
        isFetched={isFetched}
        onClickTableHead={onClickTableHead}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
      />
    </div>
  );
};

export default PoolList;
