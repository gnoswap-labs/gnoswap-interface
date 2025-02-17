import React from "react";
import { useAtomValue } from "jotai";

import SwapInfoTransactionList from "@layouts/swap/components/swap-info-transaction-list/SwapInfoTransactionList";
import { useWindowSize } from "@hooks/common/use-window-size";
import { SwapState } from "@states/index";
import { useGetSwapHistory } from "@query/swap";

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

  const swapValue = useAtomValue(SwapState.swap);
  const { tokenA, tokenB } = swapValue;

  const isTokenPairSelected = Boolean(tokenA?.path && tokenB?.path);

  const { data } = useGetSwapHistory(
    { tokenAPath: tokenA?.path || "", tokenBPath: tokenB?.path || "" },
    { enabled: isTokenPairSelected },
  );
  console.log(data, "data?");

  return <SwapInfoTransactionList breakpoint={breakpoint} />;
};

export default SwapInfoTransactionListContainer;
