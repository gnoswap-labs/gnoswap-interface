import WalletLayout from "@layouts/wallet-layout/WalletLayout";
import AssetListContainer from "@containers/asset-list-container/AssetListContainer";
import WalletBalanceContainer from "@containers/wallet-balance-container/WalletBalanceContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import WalletMyPositions from "@components/wallet/wallet-my-positions/WalletMyPositions";
import WalletMyPositionsHeader from "@components/wallet/wallet-my-positions-header/WalletMyPositionsHeader";
import WalletPositionCardListContainer from "@containers/wallet-position-card-list-container/WalletPositionCardListContainer";

export default function Wallet() {
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
}
