import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import StakingContainer from "@containers/staking-container/StakingContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";

export default function Pool() {
  return (
    <PoolLayout
      header={<HeaderContainer />}
      poolPairInformation={<PoolPairInformationContainer />}
      liquidity={<MyLiquidityContainer />}
      staking={<StakingContainer />}
      footer={<Footer />}
    />
  );
}
