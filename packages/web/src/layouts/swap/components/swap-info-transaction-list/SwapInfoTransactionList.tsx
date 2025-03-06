import React from "react";

import { SwapInfoTransactionListWrapper } from "./SwapInfoTransactionList.styles";

import SwapInfoTransactionListTable from "./swap-info-transaction-list-table/SwapInfoTransactionListTable";
import { DEVICE_TYPE } from "@styles/media";
import { SwapHistoryItem } from "@repositories/swap/response/swap-history-response";
import { TokenPairParams } from "@layouts/swap/containers/swap-info-transaction-list-container/SwapInfoTransactionListContainer";

interface SwapInfoTransactionListProps {
  breakpoint: DEVICE_TYPE;
  swapHistory: SwapHistoryItem[];
  tokenPairParams: TokenPairParams;
}

const SwapInfoTransactionList = ({ breakpoint, swapHistory, tokenPairParams }: SwapInfoTransactionListProps) => {
  return (
    <SwapInfoTransactionListWrapper>
      <SwapInfoTransactionListTable
        breakpoint={breakpoint}
        swapHistory={swapHistory}
        tokenPairParams={tokenPairParams}
      />
    </SwapInfoTransactionListWrapper>
  );
};

export default SwapInfoTransactionList;
