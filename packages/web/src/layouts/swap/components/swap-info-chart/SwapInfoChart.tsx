import React from "react";
import { useAtomValue } from "jotai";

import { SwapState } from "@states/index";

import { SwapInfoChartWrapper } from "./SwapInfoChart.styles";
import SwapTokenInfo from "./swap-token-info/SwapTokenInfo";
import { Divider } from "@components/common/divider/divider";
import { GNOT_TOKEN_DEFAULT } from "@common/values/token-constant";

const SwapInfoChart = () => {
  const swapValue = useAtomValue(SwapState.swap);
  const { tokenA, tokenB } = swapValue;
  const DEFAULT_TOKEN = GNOT_TOKEN_DEFAULT;

  const hasNoTokens = !tokenA && !tokenB;
  const isTokenPairSelected = tokenA && tokenB;

  return (
    <SwapInfoChartWrapper>
      {hasNoTokens && <SwapTokenInfo token={DEFAULT_TOKEN} />}
      {tokenA && <SwapTokenInfo token={tokenA} />}
      {isTokenPairSelected && <Divider />}
      {tokenB && <SwapTokenInfo token={tokenB} />}
    </SwapInfoChartWrapper>
  );
};

export default SwapInfoChart;
