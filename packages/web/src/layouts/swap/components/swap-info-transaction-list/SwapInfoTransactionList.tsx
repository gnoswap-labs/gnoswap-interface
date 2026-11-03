import React from "react";

import { SwapInfoTransactionListWrapper } from "./SwapInfoTransactionList.styles";

import SwapInfoTransactionListTable from "./swap-info-transaction-list-table/SwapInfoTransactionListTable";
import { DEVICE_TYPE } from "@styles/media";
import { SwapHistoryItem } from "@repositories/swap/response/swap-history-response";

interface SwapInfoTransactionListProps {
  breakpoint: DEVICE_TYPE;
  swapHistory: SwapHistoryItem[];
}

const SwapInfoTransactionList = ({ breakpoint, swapHistory }: SwapInfoTransactionListProps) => {
  return (
    <SwapInfoTransactionListWrapper>
      <SwapInfoTransactionListTable breakpoint={breakpoint} swapHistory={swapHistory} />
    </SwapInfoTransactionListWrapper>
  );
};

export default SwapInfoTransactionList;
