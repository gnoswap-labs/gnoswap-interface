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

  const tokenPairParams = React.useMemo(
    () => ({
      tokenAPath: tokenA?.wrappedPath || tokenA?.path || "",
      tokenBPath: tokenB?.wrappedPath || tokenB?.path || "",
    }),
    [tokenA?.wrappedPath, tokenA?.path, tokenB?.wrappedPath, tokenB?.path],
  );

  const isTokenPairSelected = Boolean(tokenA?.path && tokenB?.path);

  const { data: swapHistory } = useGetSwapHistory(tokenPairParams, {
    enabled: isTokenPairSelected,
  });

  if (!swapHistory || swapHistory?.length === 0) {
    return null;
  }

  return <SwapInfoTransactionList breakpoint={breakpoint} swapHistory={swapHistory} />;
};

export default SwapInfoTransactionListContainer;
