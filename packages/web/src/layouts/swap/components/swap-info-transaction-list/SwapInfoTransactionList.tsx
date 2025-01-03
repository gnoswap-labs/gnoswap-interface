import React from "react";

import { SwapInfoTransactionListWrapper } from "./SwapInfoTransactionList.styles";

import SwapInfoTransactionListTable from "./swap-info-transaction-list-table/SwapInfoTransactionListTable";
import { DEVICE_TYPE } from "@styles/media";

interface SwapInfoTransactionListProps {
  breakpoint: DEVICE_TYPE;
}

const SwapInfoTransactionList = ({ breakpoint }: SwapInfoTransactionListProps) => {
  return (
    <SwapInfoTransactionListWrapper>
      <SwapInfoTransactionListTable breakpoint={breakpoint} />
    </SwapInfoTransactionListWrapper>
  );
};

export default SwapInfoTransactionList;
