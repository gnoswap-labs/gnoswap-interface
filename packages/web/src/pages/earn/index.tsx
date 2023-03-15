import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import React from "react";

export default function Earn() {
  return (
    <div>
      <MyPositionCardListContainer />
      <IncentivizedPoolCardListContainer />
      <PoolListContainer />

      <Footer />
    </div>
  );
}
