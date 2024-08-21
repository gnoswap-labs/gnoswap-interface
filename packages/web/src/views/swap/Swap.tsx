import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import SwapContainer from "@containers/swap-container/SwapContainer";
import SwapLiquidityContainer from "@containers/swap-liquidity-container/SwapLiquidityContainer";

import SwapLayout from "./SwapLayout";

const Swap: React.FC = () => {
  return (
    <SwapLayout
      header={<HeaderContainer />}
      swap={<SwapContainer />}
      liquidity={<SwapLiquidityContainer />}
      footer={<Footer />}
    />
  );
};

export default Swap;