import {
  Asset,
  ASSET_FILTER_TYPE,
} from "@containers/asset-list-container/AssetListContainer";
import AssetListHeader from "@components/wallet/asset-list-header/AssetListHeader";
import AssetListTable from "@components/wallet/asset-list-table/AssetListTable";
import { AssetListWrapper } from "./AssetList.styles";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";

interface AssetListProps {
  assets: Asset[];
  isFetched: boolean;
  assetType: ASSET_FILTER_TYPE;
  invisibleZeroBalance: boolean;
  keyword: string;
  extended: boolean;
  hasLoader: boolean;
  changeAssetType: (assetType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleInvisibleZeroBalance: () => void;
  toggleExtended: () => void;
  deposit: (assetId: string) => void;
  withdraw: (assetId: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  isFetched,
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
      isFetched={isFetched}
      assets={assets}
      deposit={deposit}
      withdraw={withdraw}
    />
    {hasLoader && <LoadMoreButton show={!extended} onClick={toggleExtended} />}
  </AssetListWrapper>
);

export default AssetList;
