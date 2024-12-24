import React from "react";
import { useAtomValue } from "jotai";

import { SwapState } from "@states/index";

import { SwapInfoChartWrapper } from "./SwapInfoChart.styles";
import SwapTokenInfo from "./swap-token-info/SwapTokenInfo";
import { Divider } from "@components/common/divider/divider";

const SwapInfoChart = () => {
  const swapValue = useAtomValue(SwapState.swap);
  const { tokenA, tokenB } = swapValue;

  const isTokenPairSelected = tokenA && tokenB;

  return (
    <SwapInfoChartWrapper>
      {tokenA && <SwapTokenInfo token={tokenA} />}
      {isTokenPairSelected && <Divider />}
      {tokenB && <SwapTokenInfo token={tokenB} />}
    </SwapInfoChartWrapper>
  );
};

export default SwapInfoChart;
