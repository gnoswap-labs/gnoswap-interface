import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";
import StakingContainer from "@containers/staking-container/StakingContainer";
import AddIncentiveContainer from "@containers/add-incentive-banner-container/AddIncentiveBannerContainer";

export default function Pool() {
  return (
    <PoolLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer />}
      poolPairInformation={<PoolPairInformationContainer />}
      liquidity={<MyLiquidityContainer />}
      staking={<StakingContainer />}
      addIncentive={<AddIncentiveContainer />}
      footer={<Footer />}
    />
  );
}
