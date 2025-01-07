import React from "react";

import SwapInfoTransactionList from "@layouts/swap/components/swap-info-transaction-list/SwapInfoTransactionList";
import { useWindowSize } from "@hooks/common/use-window-size";

export const TABLE_HEAD = {
  TIME: "Time",
  VALUE: "Value",
  Swap: "Swap",
};

export const MOBILE_TABLE_HEAD = {
  TIME: "Time",
  Swap: "Swap",
};

const SwapInfoTransactionListContainer = () => {
  const { breakpoint } = useWindowSize();
  return <SwapInfoTransactionList breakpoint={breakpoint} />;
};

export default SwapInfoTransactionListContainer;
