import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import EarnLayout from "@layouts/earn-layout/EarnLayout";

export default function Earn() {
  return (
    <EarnLayout
      header={<HeaderContainer />}
      positions={<MyPositionCardListContainer />}
      incentivizedPools={<IncentivizedPoolCardListContainer />}
      poolList={<PoolListContainer />}
      footer={<Footer />}
    />
  );
}
