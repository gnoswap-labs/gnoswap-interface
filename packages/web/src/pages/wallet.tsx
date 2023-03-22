import WalletLayout from "@layouts/wallet-layout/WalletLayout";
import AssetListContainer from "@containers/asset-list-container/AssetListContainer";
import WalletBalanceContainer from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletPositionCardListContainer from "@containers/wallet-position-card-list-container/WalletPositionCardListContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";

export default function Wallet() {
  return (
    <WalletLayout
      header={<HeaderContainer />}
      balance={<WalletBalanceContainer />}
      assets={<AssetListContainer />}
      positions={<WalletPositionCardListContainer />}
      footer={<Footer />}
    />
  );
}
