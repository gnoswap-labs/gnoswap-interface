import React from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import { ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";
import { AssetListHeaderWrapper } from "./AssetListHeader.styles";
import SelectTab from "@components/common/select-tab/SelectTab";
import Switch from "@components/common/switch/Switch";

interface AssetListHeaderProps {
  assetType: ASSET_FILTER_TYPE;
  invisibleZeroBalance: boolean;
  keyword: string;
  changeAssetType: (newType: string) => void;
  toggleInvisibleZeroBalance: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AssetListHeader: React.FC<AssetListHeaderProps> = ({
  assetType,
  invisibleZeroBalance,
  keyword,
  changeAssetType,
  toggleInvisibleZeroBalance,
  search,
}) => (
  <AssetListHeaderWrapper>
    <h2>Assets</h2>
    <SelectTab
      selectType={assetType}
      list={Object.values(ASSET_FILTER_TYPE)}
      onClick={changeAssetType}
    />
    <div className="right-section">
      <Switch
        checked={invisibleZeroBalance}
        onChange={toggleInvisibleZeroBalance}
        hasLabel={true}
        disabled={assetType === ASSET_FILTER_TYPE.GRC20}
      />
      <SearchInput
        width={300}
        value={keyword}
        onChange={search}
        className="assets-search"
      />
    </div>
  </AssetListHeaderWrapper>
);

export default AssetListHeader;
