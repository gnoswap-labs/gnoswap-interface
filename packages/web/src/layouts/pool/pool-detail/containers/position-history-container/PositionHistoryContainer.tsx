import { useWindowSize } from "@hooks/common/use-window-size";
import React, { useEffect } from "react";
import { ValuesType } from "utility-types";

import { useLoading } from "@hooks/common/use-loading";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { useGetPositionHistory } from "@query/positions";
import { makeDisplayTokenAmount } from "@utils/token-utils";

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

const PositionHistoryContainer: React.FC<PositionHistoryContainerProps> = ({ position }) => {
  const { breakpoint } = useWindowSize();
  const { isLoading: isLoadingCommon } = useLoading();
  const { data: historyList = [], refetch, isFetched, isLoading } = useGetPositionHistory(position?.lpTokenId);

  const positionHistoryList: IPositionHistoryModel[] = React.useMemo(() => {
    if (!historyList) return [];

    return historyList.map((history: IPositionHistoryModel) => {
      return {
        ...history,
        amountA: makeDisplayTokenAmount(position.pool.tokenA, history.amountA) ?? 0,
        amountB: makeDisplayTokenAmount(position.pool.tokenB, history.amountB) ?? 0,
      };
    });
  }, [historyList]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <PositionHistoryList
      list={positionHistoryList.filter(item => item.amountA || item.amountB)}
      isLoading={isLoading || isLoadingCommon}
      isFetched={isFetched}
      breakpoint={breakpoint}
    />
  );
};

export default PositionHistoryContainer;
