import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";

import WalletMyPositionsHeader from "./components/wallet-my-positions-header/WalletMyPositionsHeader";
import WalletMyPositions from "./components/wallet-my-positions/WalletMyPositions";
import AssetListContainer from "./containers/asset-list-container/AssetListContainer";
import WalletBalanceContainer from "./containers/wallet-balance-container/WalletBalanceContainer";
import WalletPositionCardListContainer from "./containers/wallet-position-card-list-container/WalletPositionCardListContainer";

import WalletLayout from "./PortfolioLayout";

const Portfolio: React.FC = () => {
  const [isShowClosedPosition, setIsShowClosedPosition] = React.useState(false);

  const toggleShowClosedPosition = () => {
    setIsShowClosedPosition(prev => !prev);
  };

  return (
    <WalletLayout
      header={<HeaderContainer />}
      balance={<WalletBalanceContainer />}
      assets={<AssetListContainer />}
      positions={
        <WalletMyPositions
          header={<WalletMyPositionsHeader toggleClosed={toggleShowClosedPosition} isClosed={isShowClosedPosition} />}
          cardList={<WalletPositionCardListContainer isClosed={isShowClosedPosition} />}
        />
      }
      footer={<Footer />}
    />
  );
};
export default Portfolio;
