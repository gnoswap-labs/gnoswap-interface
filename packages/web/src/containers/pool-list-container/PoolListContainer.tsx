import PoolList from "@components/earn/pool-list/PoolList";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { ValuesType } from "utility-types";

export interface Pool {
  id: string;
}

export const POOL_TYPE = {
  ALL: "all",
  INCENTIVIZED: "incentivized",
  NON_INCENTIVIZED: "non-incentivized",
} as const;

export type POOL_TYPE = ValuesType<typeof POOL_TYPE>;

async function fetchPools(
  type: POOL_TYPE,
  page: number,
  keyword: string,
): Promise<Pool[]> {
  console.debug("fetchPools", type, page, keyword);
  return Promise.resolve([{ id: "BTC" }, { id: "GNOS" }]);
}

const PoolListContainer: React.FC = () => {
  const [poolType, setPoolType] = useState<POOL_TYPE>(POOL_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");

  const changePoolType = useCallback((newPoolType: POOL_TYPE) => {
    setPoolType(newPoolType);
  }, []);

  const {
    isLoading,
    error,
    data: pools,
  } = useQuery<Pool[], Error>({
    queryKey: ["pools", poolType, page, keyword],
    queryFn: () => fetchPools(poolType, page, keyword),
  });

  const search = useCallback((searchKeyword: string) => {
    setKeyword(searchKeyword);
  }, []);

  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <PoolList
      pools={pools}
      isLoading={isLoading}
      error={error}
      poolType={poolType}
      changePoolType={changePoolType}
      search={search}
      currentPage={page}
      totalPage={10}
      movePage={movePage}
    />
  );
};

export default PoolListContainer;
