import React from "react";
import {
  IncreaseLiquidityWrapper,
  LoadingWrapper,
} from "./IncreaseLiquidity.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

const IncreaseLiquidity: React.FC = () => {
  return (
    <IncreaseLiquidityWrapper>
      <h3>Increase Liquidity</h3>

      <LoadingWrapper>
        <LoadingSpinner />
      </LoadingWrapper>
    </IncreaseLiquidityWrapper>
  );
};

export default IncreaseLiquidity;
