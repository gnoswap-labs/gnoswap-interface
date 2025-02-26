import React from "react";

import SwapInfoTransactionList from "@layouts/swap/components/swap-info-transaction-list/SwapInfoTransactionList";
import { useWindowSize } from "@hooks/common/use-window-size";

export const TABLE_HEAD = {
  TIME: "Dashboard:onchainActi.col.time",
  VALUE: "Pool:position.card.history.col.value",
  Swap: "Swap:header",
};

export const MOBILE_TABLE_HEAD = {
  TIME: "Dashboard:onChainActi.col.time",
  Swap: "Swap:header",
};

const SwapInfoTransactionListContainer = () => {
  const { breakpoint } = useWindowSize();
  return <SwapInfoTransactionList breakpoint={breakpoint} />;
};

export default SwapInfoTransactionListContainer;
