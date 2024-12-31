import React from "react";

import SwapInfoTransactionList from "@layouts/swap/components/swap-info-transaction-list/SwapInfoTransactionList";

export const TABLE_HEAD = {
  TIME: "Time",
  VALUE: "Value",
  Swap: "Swap",
};

const SwapInfoTransactionListContainer = () => {
  return <SwapInfoTransactionList />;
};

export default SwapInfoTransactionListContainer;
