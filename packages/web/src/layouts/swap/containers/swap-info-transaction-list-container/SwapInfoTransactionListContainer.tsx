import React from "react";
import { useAtomValue } from "jotai";

import SwapInfoTransactionList from "@layouts/swap/components/swap-info-transaction-list/SwapInfoTransactionList";
import { useWindowSize } from "@hooks/common/use-window-size";
import { SwapState } from "@states/index";
import { useGetSwapHistory } from "@query/swap";
import { SwapConverter } from "@services/converters/swap";

export const TABLE_HEAD = {
  TIME: "Dashboard:onchainActi.col.time",
  VALUE: "Pool:position.card.history.col.value",
  Swap: "Swap:header",
};

export const MOBILE_TABLE_HEAD = {
  TIME: "Dashboard:onchainActi.col.time",
  Swap: "Swap:header",
};

const SWAP_HISTORY_LIMIT = 100;

export interface TokenPairParams {
  tokenAPath: string;
  tokenBPath: string;
}

const SwapInfoTransactionListContainer = () => {
  const { breakpoint } = useWindowSize();

  const swapValue = useAtomValue(SwapState.swap);
  const { tokenA, tokenB } = swapValue;

  const tokenPairParams = React.useMemo<TokenPairParams>(
    () => ({
      tokenAPath: tokenA?.wrappedPath || tokenA?.path || "",
      tokenBPath: tokenB?.wrappedPath || tokenB?.path || "",
    }),
    [tokenA?.wrappedPath, tokenA?.path, tokenB?.wrappedPath, tokenB?.path],
  );

  const isTokenPairSelected = Boolean(tokenA?.path && tokenB?.path);

  const { data: swapHistory } = useGetSwapHistory(
    { ...tokenPairParams, limit: SWAP_HISTORY_LIMIT },
    {
      enabled: isTokenPairSelected,
    },
  );

  const swapHistoryList = React.useMemo(() => {
    return SwapConverter.convertSwapHistory(swapHistory);
  }, [swapHistory]);

  if (!swapHistory || swapHistory?.length === 0) {
    return null;
  }

  return (
    // Remount per token pair so page, snapshot and highlight state never carry over to another pair
    <SwapInfoTransactionList
      key={`${tokenPairParams.tokenAPath}-${tokenPairParams.tokenBPath}`}
      breakpoint={breakpoint}
      swapHistory={swapHistoryList}
    />
  );
};

export default SwapInfoTransactionListContainer;
