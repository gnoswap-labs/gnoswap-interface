import React, { useCallback, useMemo, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useIncentivizePool } from "@hooks/pool/data/use-incentivize-pool";

import AvailableStakingPools, {
  AvailableStakingPoolsSortKey,
  SortDirection,
} from "../../components/available-staking-pools/AvailableStakingPools";

const compareNumber = (a: number, b: number, direction: SortDirection) => {
  if (a === b) return 0;
  return direction === "asc" ? a - b : b - a;
};

const compareString = (a: string, b: string, direction: SortDirection) => {
  const result = a.localeCompare(b);
  return direction === "asc" ? result : -result;
};

interface SortState {
  key: AvailableStakingPoolsSortKey;
  direction: SortDirection;
}

const DEFAULT_SORT: SortState = { key: "tvl", direction: "desc" };

const AvailableStakingPoolsContainer: React.FC = () => {
  const router = useCustomRouter();
  const { data: incentivizePools = [], isLoading } = useIncentivizePool();

  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);

  const sortedPools = useMemo(() => {
    const list = [...incentivizePools];
    list.sort((a, b) => {
      switch (sort.key) {
        case "poolName":
          return compareString(a.poolPath ?? "", b.poolPath ?? "", sort.direction);
        case "stakingApr":
          return compareNumber(Number(a.stakingApr) || 0, Number(b.stakingApr) || 0, sort.direction);
        case "tvl":
        default:
          return compareNumber(Number(a.tvl) || 0, Number(b.tvl) || 0, sort.direction);
      }
    });
    return list;
  }, [incentivizePools, sort]);

  const onChangeSort = useCallback((key: AvailableStakingPoolsSortKey) => {
    setSort(prev => {
      // Different column: start at ASC.
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      // Same column cycle: DESC -> ASC -> DEFAULT (TVL desc).
      // Starting from DESC lets a click on the default-sorted column toggle to ASC immediately.
      if (prev.direction === "desc") {
        return { key, direction: "asc" };
      }
      return DEFAULT_SORT;
    });
  }, []);

  const onSelectPool = useCallback(
    (selectedPoolPath: string) => {
      router.movePageWithPoolPath("POOL_STAKE", selectedPoolPath);
    },
    [router],
  );

  return (
    <AvailableStakingPools
      pools={sortedPools}
      isLoading={isLoading}
      onSelectPool={onSelectPool}
      sortKey={sort.key}
      sortDirection={sort.direction}
      onChangeSort={onChangeSort}
    />
  );
};

export default AvailableStakingPoolsContainer;
