import { Asset, ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";
import AssetListHeader from "@components/wallet/asset-list-header/AssetListHeader";
import AssetListTable from "@components/wallet/asset-list-table/AssetListTable";
import AssetListLoader from "@components/wallet/asset-list-loader/AssetListLoader";
import { AssetListWrapper } from "./AssetList.styles";

interface AssetListProps {
  assets: Asset[];
  isLoading: boolean;
  error: Error | null;
  assetType: ASSET_FILTER_TYPE;
  invisibleZeroBalance: boolean;
  keyword: string;
  extended: boolean;
  hasLoader: boolean;
  changeAssetType: (assetType: ASSET_FILTER_TYPE) => void;
  search: (keyword: string) => void;
  toggleInvisibleZeroBalance: () => void;
  toggleExtended: () => void;
  deposit: (assetId: string) => void;
  withdraw: (assetId: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  isLoading,
  error,
  assetType,
  invisibleZeroBalance,
  keyword,
  extended,
  hasLoader,
  changeAssetType,
  search,
  toggleInvisibleZeroBalance,
  toggleExtended,
  deposit,
  withdraw,
}) => (
  <AssetListWrapper>
    <AssetListHeader
      assetType={assetType}
      invisibleZeroBalance={invisibleZeroBalance}
      keyword={keyword}
      changeAssetType={changeAssetType}
      toggleInvisibleZeroBalance={toggleInvisibleZeroBalance}
      search={search}
    />
    <AssetListTable
      isLoading={isLoading}
      error={error}
      assets={assets}
      deposit={deposit}
      withdraw={withdraw}
    />
    {
      hasLoader &&
      <AssetListLoader
        extended={extended}
        toggleExtended={toggleExtended}
      />
    }
  </AssetListWrapper>
);

export default AssetList;
