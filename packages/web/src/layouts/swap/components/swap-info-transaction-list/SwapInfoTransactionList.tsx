import React from "react";

import { SwapInfoTransactionListWrapper } from "./SwapInfoTransactionList.styles";

import SwapInfoTransactionListTable from "./swap-info-transaction-list-table/SwapInfoTransactionListTable";

const SwapInfoTransactionList = () => {
  return (
    <SwapInfoTransactionListWrapper>
      <SwapInfoTransactionListTable />
    </SwapInfoTransactionListWrapper>
  );
};

export default SwapInfoTransactionList;
