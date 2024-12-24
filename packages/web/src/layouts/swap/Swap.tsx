import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";

import SwapContainer from "./containers/swap-container/SwapContainer";
import SwapInfoChartContainer from "./containers/swap-info-chart-container/SwapInfoChartContainer";

import SwapLayout from "./SwapLayout";

const Swap: React.FC = () => {
  return (
    <SwapLayout
      header={<HeaderContainer />}
      swap={<SwapContainer />}
      chart={<SwapInfoChartContainer />}
      footer={<Footer />}
    />
  );
};

export default Swap;
