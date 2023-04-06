import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import EarnLayout from "@layouts/earn-layout/EarnLayout";
import EarnMyPositions from "@components/earn/earn-my-positions/EarnMyPositions";
import EarnMyPositionsHeader from "@components/earn/earn-my-positions-header/EarnMyPositionsHeader";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import EarnIncentivizedPools from "@components/earn/earn-incentivized-pools/EarnIncentivizedPools";

export default function Earn() {
  return (
    <EarnLayout
      header={<HeaderContainer />}
      positions={
        <EarnMyPositions
          header={<EarnMyPositionsHeader />}
          cardList={<MyPositionCardListContainer loadMore={true} />}
        />
      }
      incentivizedPools={
        <EarnIncentivizedPools
          cardList={<IncentivizedPoolCardListContainer />}
        />
      }
      poolList={<PoolListContainer />}
      footer={<Footer />}
    />
  );
}
