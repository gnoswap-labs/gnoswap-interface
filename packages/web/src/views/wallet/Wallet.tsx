import React from "react";

import Footer from "@components/common/footer/Footer";
import WalletMyPositionsHeader from "@components/wallet/wallet-my-positions-header/WalletMyPositionsHeader";
import WalletMyPositions from "@components/wallet/wallet-my-positions/WalletMyPositions";
import AssetListContainer from "@containers/asset-list-container/AssetListContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import WalletBalanceContainer from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletPositionCardListContainer from "@containers/wallet-position-card-list-container/WalletPositionCardListContainer";

import WalletLayout from "./WalletLayout";

const Wallet: React.FC =()=> {
  return (
    <WalletLayout
      header={<HeaderContainer />}
      balance={<WalletBalanceContainer />}
      assets={<AssetListContainer />}
      positions={
        <WalletMyPositions
          header={<WalletMyPositionsHeader />}
          cardList={<WalletPositionCardListContainer />}
        />
      }
      footer={<Footer />}
    />
  );
};
export default Wallet;
