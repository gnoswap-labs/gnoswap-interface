import React from "react";

import HeaderContainer from "@containers/header-container/HeaderContainer";
import SwapLayout from "./SwapLayout";
import SwapContainer from "./containers/swap-container/SwapContainer";
import SwapInfoChartContainer from "./containers/swap-info-chart-container/SwapInfoChartContainer";
import SwapInfoTransactionListContainer from "./containers/swap-info-transaction-list-container/SwapInfoTransactionListContainer";
import Footer from "@components/common/footer/Footer";

const Swap: React.FC = () => {
  return (
    <SwapLayout
      header={<HeaderContainer />}
      swap={<SwapContainer />}
      chart={<SwapInfoChartContainer />}
      info={<SwapInfoTransactionListContainer />}
      footer={<Footer />}
    />
  );
};

export default Swap;
