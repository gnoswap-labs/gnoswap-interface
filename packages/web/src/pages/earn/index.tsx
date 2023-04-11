import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import EarnLayout from "@layouts/earn-layout/EarnLayout";
import EarnMyPositions from "@components/earn/earn-my-positions/EarnMyPositions";
import EarnMyPositionsHeader from "@components/earn/earn-my-positions-header/EarnMyPositionsHeader";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import EarnMyPositonsUnconnected from "@components/earn/earn-my-positions-unconnected/EarnMyPositonsUnconnected";
import EarnMyPositionNoLiquidity from "@components/earn/earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import EarnMyPositionsContentContainer from "@containers/earn-my-positions-content-container/EarnMyPositionsContentContainer";
import EarnIncentivizedPools from "@components/earn/earn-incentivized-pools/EarnIncentivizedPools";

export default function Earn() {
  return (
    <EarnLayout
      header={<HeaderContainer />}
      positions={
        <EarnMyPositions
          header={<EarnMyPositionsHeader />}
          content={
            <EarnMyPositionsContentContainer
              unconnected={<EarnMyPositonsUnconnected />}
              noLiquidity={<EarnMyPositionNoLiquidity />}
              cardList={<MyPositionCardListContainer />}
            />
          }
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
