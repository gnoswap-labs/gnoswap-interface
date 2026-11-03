import { useWindowSize } from "@hooks/common/use-window-size";
import React, { useState } from "react";
import { ValuesType } from "utility-types";

import { useLoading } from "@hooks/common/use-loading";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { useGetPositionHistory } from "@query/positions/use-get-position-history";
import { PositionConverter } from "@services/converters/position";

import PositionHistoryList from "../../components/position-history-list/PositionHistoryList";

export interface SortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
}

export const TABLE_HEAD = {
  TIMESTAMP: "Pool:position.card.history.col.time",
  ACTION: "Pool:position.card.history.col.action",
  VALUE: "Pool:position.card.history.col.value",
  TOKEN_A_AMOUNT: "Token Amount",
  TOKEN_B_AMOUNT: "Token Amount",
} as const;
export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

interface PositionHistoryContainerProps {
  position: PoolPositionModel;
}

const HISTORY_PAGE_SIZE = 20;
const EMPTY_HISTORY: IPositionHistoryModel[] = [];

const PositionHistoryPage: React.FC<PositionHistoryContainerProps> = ({ position }) => {
  const [page, setPage] = useState(1);
  const { breakpoint } = useWindowSize();
  const { isLoading: isLoadingCommon } = useLoading();
  const { data, isFetched, isLoading, isFetching } = useGetPositionHistory(position.lpTokenId, page, HISTORY_PAGE_SIZE);
  const historyList = data?.history ?? EMPTY_HISTORY;
  const totalPage = Math.ceil((data?.totalCount ?? 0) / HISTORY_PAGE_SIZE);

  const positionHistoryList: IPositionHistoryModel[] = React.useMemo(() => {
    const tokenA = position.pool.tokenA;
    const tokenB = position.pool.tokenB;

    return PositionConverter.convertPositionHistory(historyList, tokenA, tokenB);
  }, [historyList, position.pool.tokenA, position.pool.tokenB]);

  return (
    <PositionHistoryList
      list={positionHistoryList.filter(item => item.amountA || item.amountB)}
      isLoading={isLoading || isFetching || isLoadingCommon}
      isFetched={isFetched}
      breakpoint={breakpoint}
      currentPage={page}
      totalPage={totalPage}
      movePage={setPage}
      isFetching={isFetching}
    />
  );
};

const PositionHistoryContainer: React.FC<PositionHistoryContainerProps> = ({ position }) => (
  <PositionHistoryPage key={position.lpTokenId} position={position} />
);

export default PositionHistoryContainer;
