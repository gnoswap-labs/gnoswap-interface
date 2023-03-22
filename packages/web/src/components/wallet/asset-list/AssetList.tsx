import { css } from "@emotion/react";

import { Asset, ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";

interface AssetListListProps {
  assets: Asset[] | undefined;
  isLoading: boolean;
  error: Error | null;
  assetFilterType: ASSET_FILTER_TYPE;
  changeAssetFilterType: (AssetFilterType: ASSET_FILTER_TYPE) => void;
  invisibleEmptyAsset: boolean;
  toggleInvisibleEmptyAsset: () => void;
  search: (keyword: string) => void;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
}

const AssetList: React.FC<AssetListListProps> = ({
  assets,
  isLoading,
  error,
  assetFilterType,
  changeAssetFilterType,
  search,
  currentPage,
  totalPage,
  movePage,
}) => (
  <div
    css={css`
      border: 1px solid green;
    `}
  >
    <h2>AssetList</h2>
  </div>
);

export default AssetList;
