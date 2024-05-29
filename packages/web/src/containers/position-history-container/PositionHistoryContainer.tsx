import { useWindowSize } from "@hooks/common/use-window-size";
import React from "react";
import { ValuesType } from "utility-types";

import PositionHistoryList from "@components/pool/position-history-list/PositionHistoryList";
import { TokenModel } from "@models/token/token-model";
import { useGetPositionHistory } from "@query/positions";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useLoading } from "@hooks/common/use-loading";
export interface SortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
}

export const TABLE_HEAD = {
  TIMESTAMP: "Timestamp",
  ACTION: "Action",
  VALUE: "Value",
  GNS_AMOUNT: "Token Amount",
  GNOT_AMOUNT: "Token Amount",
} as const;
export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

interface PositionHistoryContainerProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  position: PoolPositionModel;
}

const PositionHistoryContainer: React.FC<PositionHistoryContainerProps> = ({
  tokenA,
  tokenB,
  position,
}) => {
  const { breakpoint } = useWindowSize();
  const { isLoading: isLoadingCommon } = useLoading();
  const {
    data: historyList = [],
    isFetched,
    isLoading,
  } = useGetPositionHistory(position?.lpTokenId);

  return (
    <PositionHistoryList
      list={historyList}
      isLoading={isLoading || isLoadingCommon}
      isFetched={isFetched}
      breakpoint={breakpoint}
      tokenA={tokenA}
      tokenB={tokenB}
    />
  );
};

export default PositionHistoryContainer;
