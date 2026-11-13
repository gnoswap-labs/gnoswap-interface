import React from "react";

import { IS_ORDER_ENABLED } from "@constants/order.constant";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import { LimitMarketPriceProvider } from "@providers/limit-market-price-provider/LimitMarketPriceProvider";
import SwapLayout from "./SwapLayout";
import OrderListContainer from "./containers/order-list-container/OrderListContainer";
import SwapContainer from "./containers/swap-container/SwapContainer";
import SwapInfoChartContainer from "./containers/swap-info-chart-container/SwapInfoChartContainer";
import SwapInfoTransactionListContainer from "./containers/swap-info-transaction-list-container/SwapInfoTransactionListContainer";
import Footer from "@components/common/footer/Footer";

const Swap: React.FC = () => {
  // One market price query serves both the Limit form and its order list.
  return (
    <LimitMarketPriceProvider>
      <SwapLayout
        header={<HeaderContainer />}
        swap={<SwapContainer />}
        orders={IS_ORDER_ENABLED ? <OrderListContainer /> : undefined}
        chart={<SwapInfoChartContainer />}
        info={<SwapInfoTransactionListContainer />}
        footer={<Footer />}
      />
    </LimitMarketPriceProvider>
  );
};

export default Swap;
