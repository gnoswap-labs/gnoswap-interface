import { useWindowSize } from "@hooks/common/use-window-size";
import React, { useEffect } from "react";
import { ValuesType } from "utility-types";

import { useLoading } from "@hooks/common/use-loading";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useGetPositionHistory } from "@query/positions";

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

const PositionHistoryContainer: React.FC<PositionHistoryContainerProps> = ({
  position,
}) => {
  const { breakpoint } = useWindowSize();
  const { isLoading: isLoadingCommon } = useLoading();
  const {
    data: historyList = [],
    refetch,
    isFetched,
    isLoading,
  } = useGetPositionHistory(position?.lpTokenId);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <PositionHistoryList
      list={historyList.filter(item => item.amountA || item.amountB)}
      isLoading={isLoading || isLoadingCommon}
      isFetched={isFetched}
      breakpoint={breakpoint}
    />
  );
};

export default PositionHistoryContainer;
