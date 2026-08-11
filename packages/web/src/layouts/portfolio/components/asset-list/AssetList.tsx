import React from "react";

import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { DEVICE_TYPE } from "@styles/media";

import AssetListHeader, { ASSET_FILTER_TYPE } from "./asset-list-header/AssetListHeader";
import AssetListTable, { AssetSortOption, ASSET_HEAD, type Asset } from "./asset-list-table/AssetListTable";

import { AssetListWrapper } from "./AssetList.styles";

interface AssetListProps {
  assets: Asset[];
  connected: boolean;
  isFetched: boolean;
  assetType?: ASSET_FILTER_TYPE;
  invisibleZeroBalance: boolean;
  showUnverifiedTokens: boolean;
  keyword: string;
  extended: boolean;
  hasLoader: boolean;
  changeAssetType: (assetType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleInvisibleZeroBalance: () => void;
  toggleShowUnverifiedTokens: () => void;
  toggleExtended: () => void;
  deposit: (asset: Asset) => void;
  withdraw: (asset: Asset) => void;
  sortOption: AssetSortOption | undefined;
  sort: (item: ASSET_HEAD) => void;
  isSortOption: (item: ASSET_HEAD) => boolean;
  moveTokenPage: (tokenPath: string) => void;
  breakpoint: DEVICE_TYPE;
  searchIcon: boolean;
  onTogleSearch: () => void;
  searchRef: React.RefObject<HTMLDivElement>;
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  connected,
  isFetched,
  assetType = ASSET_FILTER_TYPE.ALL,
  invisibleZeroBalance,
  showUnverifiedTokens,
  keyword,
  extended,
  hasLoader,
  changeAssetType,
  search,
  toggleInvisibleZeroBalance,
  toggleShowUnverifiedTokens,
  toggleExtended,
  deposit,
  withdraw,
  sort,
  moveTokenPage,
  sortOption,
  isSortOption,
  breakpoint,
  searchIcon,
  onTogleSearch,
  searchRef,
}) => (
  <AssetListWrapper>
    <AssetListHeader
      assetType={assetType}
      connected={connected}
      invisibleZeroBalance={invisibleZeroBalance}
      showUnverifiedTokens={showUnverifiedTokens}
      keyword={keyword}
      changeAssetType={changeAssetType}
      toggleInvisibleZeroBalance={toggleInvisibleZeroBalance}
      toggleShowUnverifiedTokens={toggleShowUnverifiedTokens}
      search={search}
      breakpoint={breakpoint}
      searchIcon={searchIcon}
      onTogleSearch={onTogleSearch}
      searchRef={searchRef}
    />
    <AssetListTable
      isFetched={isFetched}
      assets={assets}
      deposit={deposit}
      withdraw={withdraw}
      sort={sort}
      sortOption={sortOption}
      isSortOption={isSortOption}
      moveTokenPage={moveTokenPage}
      breakpoint={breakpoint}
    />
    {hasLoader && <LoadMoreButton show={!extended} onClick={toggleExtended} />}
  </AssetListWrapper>
);

export default AssetList;
