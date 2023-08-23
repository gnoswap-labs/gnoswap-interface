import {
  ASSET_FILTER_TYPE,
  ASSET_HEAD,
  AssetSortOption,
  type Asset,
} from "@containers/asset-list-container/AssetListContainer";
import AssetListHeader from "@components/wallet/asset-list-header/AssetListHeader";
import AssetListTable from "@components/wallet/asset-list-table/AssetListTable";
import { AssetListWrapper } from "./AssetList.styles";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { DEVICE_TYPE } from "@styles/media";

interface AssetListProps {
  assets: Asset[];
  isFetched: boolean;
  assetType?: ASSET_FILTER_TYPE;
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
  sortOption: AssetSortOption | undefined;
  sort: (item: ASSET_HEAD) => void;
  isSortOption: (item: ASSET_HEAD) => boolean;
  breakpoint: DEVICE_TYPE;
  searchIcon: boolean;
  onTogleSearch: () => void;
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  isFetched,
  assetType = ASSET_FILTER_TYPE.ALL,
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
  sort,
  sortOption,
  isSortOption,
  breakpoint,
  searchIcon,
  onTogleSearch,
}) => (
  <AssetListWrapper>
    <AssetListHeader
      assetType={assetType}
      invisibleZeroBalance={invisibleZeroBalance}
      keyword={keyword}
      changeAssetType={changeAssetType}
      toggleInvisibleZeroBalance={toggleInvisibleZeroBalance}
      search={search}
      breakpoint={breakpoint}
      searchIcon={searchIcon}
      onTogleSearch={onTogleSearch}
    />
    <AssetListTable
      isFetched={isFetched}
      assets={assets}
      deposit={deposit}
      withdraw={withdraw}
      sort={sort}
      sortOption={sortOption}
      isSortOption={isSortOption}
      breakpoint={breakpoint}
    />
    {hasLoader && <LoadMoreButton show={!extended} onClick={toggleExtended} />}
  </AssetListWrapper>
);

export default AssetList;
