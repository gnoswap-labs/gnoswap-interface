import AssetListContainer from "@containers/asset-list-container/AssetListContainer";
import WalletBalanceContainer from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletPositionCardListContainer from "@containers/wallet-position-card-list-container/WalletPositionCardListContainer";

export default function Wallet() {
  return (
    <div>
      <div>
        <div>
          <h1>Wallet</h1>
          <WalletBalanceContainer />
        </div>
      </div>

      <div>
        <div>
          <AssetListContainer />
          <WalletPositionCardListContainer />
        </div>
      </div>
    </div>
  );
}
