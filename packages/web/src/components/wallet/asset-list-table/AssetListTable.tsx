import { Asset } from "@containers/asset-list-container/AssetListContainer";
import AssetInfo from "@components/wallet/asset-info/AssetInfo";
import { AssetListTableRowWrapper, AssetListTableWrapper } from "./AssetListTable.styles";

interface AssetListTableProps {
  assets: Asset[];
  isLoading: boolean;
  error: Error | null;
  deposit: (assetId: string) => void;
  withdraw: (assetId: string) => void;
}

const AssetListTable: React.FC<AssetListTableProps> = ({
  assets,
  isLoading,
  error,
  deposit,
  withdraw
}) => (
  <AssetListTableWrapper>
    <AssetListTableRowWrapper>
      <div className="column">Asset</div>
      <div className="column">Chain</div>
      <div className="column">Balance</div>
      <div className="column right">Deposit</div>
      <div className="column right">Withdraw</div>
    </AssetListTableRowWrapper>

    <AssetListTableBody
      assets={assets}
      isLoading={isLoading}
      error={error}
      deposit={deposit}
      withdraw={withdraw}
    />
  </AssetListTableWrapper>
);

const AssetListTableBody: React.FC<AssetListTableProps> = ({
  assets,
  isLoading,
  error,
  deposit,
  withdraw
}) => {
  if (assets.length > 0) {
    return (
      <div className="body">
        {assets.map((asset, index) =>
          <AssetInfo
            key={index}
            asset={asset}
            deposit={deposit}
            withdraw={withdraw}
          />
        )}
      </div>
    );
  }

  if (isLoading) {
    return <div className="description">Loading...</div>;
  }

  if (error !== null) {
    return <div className="description">Errors</div>;
  }

  return <div className="description">No data found</div>;
};


export default AssetListTable;
